import { createContext } from 'react';
import { toJS, observable, action } from 'mobx';
import { computedFn } from 'mobx-utils';
import { observer } from 'mobx-react-lite';
import { Store } from '../interfaces/Store';
import { FormField } from '../interfaces/FormField';
import { FormFieldParent } from '../interfaces/FormFieldParent';
import { FormUnits } from '../interfaces/FormUnits';
import * as fieldInputs from '../fields';
import _set from 'lodash.set';
import _get from 'lodash.get';

export class RootStore {
  @observable model = {};
  @observable errors = {};
  @observable units: FormUnits = {};
  onModelUpdate;
  fields;
  customFieldInputs;
  allFieldInputs;

  @action init({
    fields,
    model,
    errors,
    units,
    onModelUpdate,
    customFields
  }: Store) {
    this.fields = fields;
    this.model = model;
    this.errors = errors;
    this.units = units;
    this.onModelUpdate = onModelUpdate;
    this.customFieldInputs = customFields;
    this.allFieldInputs = this.mergeInputs();
  }

  @action updateValue(value, field: FormField, ancestors: FormFieldParent[]) {
    const valuePath = this.getPathFromAncestors(field, ancestors);
    const errorPath = this.getDotNotationPathFromAncestors(field, ancestors);
    _set(this.model, valuePath, value);
    delete this.errors[errorPath];
    this.onModelUpdate(toJS(this.model));
  }

  @action addRepeaterRow(
    field: FormField,
    rowIndex: number,
    ancestors?: FormFieldParent[]
  ) {
    const blankRow = this.getBlankRepeaterRow(field);
    const path = this.getPathFromAncestors(field, ancestors);

    let currentValue = _get(toJS(this.model), path);
    let hasRows = currentValue && currentValue.length;

    if (hasRows) {
      currentValue.splice(rowIndex + 1, 0, blankRow);
      _set(this.model, path, currentValue);
      this.onModelUpdate(toJS(this.model));
      return;
    }
    _set(this.model, path, [blankRow]);
    this.onModelUpdate(toJS(this.model));
  }

  @action removeRepeaterRow(
    field: FormField,
    rowIndex: number,
    ancestors?: FormFieldParent[]
  ) {
    const path = this.getPathFromAncestors(field, ancestors);
    const currentValue = _get(toJS(this.model), path);

    let hasMultipleRows = currentValue.length > 1;

    if (hasMultipleRows) {
      currentValue.splice(rowIndex, 1);
      _set(this.model, path, currentValue);
      this.onModelUpdate(toJS(this.model));
      return;
    }

    _set(this.model, path, null);
    this.deleteErrorsForRow(field, rowIndex);
    this.onModelUpdate(toJS(this.model));
  }

  @action deleteErrorsForRow(field: FormField, rowIndex: number) {
    Object.keys(this.errors)
      .filter(key => key.includes(`${field.key}.${rowIndex}.`))
      .forEach(errorKey => delete this.errors[errorKey]);
    return;
  }

  getValue = computedFn(function getValue(
    field: FormField,
    ancestors?: FormFieldParent[]
  ) {
    const path = this.getPathFromAncestors(field, ancestors);

    if (ancestors) {
      return this.getLengthCheckedValue(path, ancestors);
    }
    const val = _get(this.model, path);

    return val;
  });

  getErrors = computedFn(function getErrors(
    field: FormField,
    ancestors?: FormFieldParent[]
  ) {
    const path = this.getDotNotationPathFromAncestors(field, ancestors);
    return _get(this.errors, path);
  });

  getPathFromAncestors(field: FormField, ancestors: FormFieldParent[] = []) {
    let path = ancestors.reduce((acc: string, ancestor: FormFieldParent) => {
      return `${acc}.${ancestor.field.key}[${ancestor.index}]`;
    }, '');
    return `${path}.${field.key}`.substr(1);
  }

  getDotNotationPathFromAncestors(
    field: FormField,
    ancestors: FormFieldParent[] = []
  ) {
    let path = ancestors.reduce((acc: string, ancestor: FormFieldParent) => {
      return `${acc}.${ancestor.field.key}.${ancestor.index}`;
    }, '');
    return `${path}.${field.key}`.substr(1);
  }

  getLengthCheckedValue(path: string, ancestors: FormFieldParent[]) {
    const ancestorsCopy = ancestors.slice();
    const lastAncestor = ancestorsCopy.pop();
    const lastAncestorPath = this.getPathFromAncestors(
      lastAncestor.field,
      ancestorsCopy
    );
    const lastAncestorValue = _get(this.model, lastAncestorPath);
    // Here we are ensuring that mobx doesn't throw a warning
    // about an index being out of bounds when a repeater row
    // is deleted
    if (lastAncestorValue.length >= lastAncestor.index + 1) {
      return _get(this.model, path);
    }
    return;
  }

  getBlankRepeaterRow(field: FormField) {
    return field.subFields
      .flatMap((field: FormField) => {
        if (field.input === 'group') {
          return field.subFields.map(subField => {
            return {
              key: subField.key,
              value: subField.defaultValue || null
            };
          });
        }
        return {
          key: field.key,
          value: field.defaultValue || null
        };
      })
      .reduce((obj, field) => {
        obj[field.key] = field.value;
        return obj;
      }, {});
  }

  getFieldName(field: FormField) {
    let ucInput = field.input.charAt(0).toUpperCase() + field.input.slice(1);

    return this.allFieldInputs[ucInput + 'Field'];
  }

  mergeInputs() {
    const customFields = this.customFieldInputs ? this.customFieldInputs : [];

    const mappedCustomFields = customFields.reduce((fields, field) => {
      fields[field.name] = observer(field);
      return fields;
    }, {});

    console.log(mappedCustomFields);

    return Object.assign(mappedCustomFields, fieldInputs);
  }
}

export default createContext(new RootStore());
