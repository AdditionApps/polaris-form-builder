import { createContext } from "react";
import { toJS, observable, action } from "mobx";
import { computedFn } from "mobx-utils";
import { observer } from "mobx-react-lite";
import { IStore } from "../interfaces/IStore";
import { IField } from "../interfaces/IField";
import { IParent } from "../interfaces/IParent";
import { IUnits } from "../interfaces/IUnits";
import * as fieldInputs from "../fields";
import _set from "lodash.set";
import _get from "lodash.get";

export class RootStore {
  @observable model = {};
  @observable errors = {};
  @observable units: IUnits = {};
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
  }: IStore) {
    this.fields = fields;
    this.model = model;
    this.errors = errors;
    this.units = units;
    this.onModelUpdate = onModelUpdate;
    this.customFieldInputs = customFields;
    this.allFieldInputs = this.mergeInputs();
  }

  @action updateValue(value, field: IField, ancestors: IParent[]) {
    const valuePath = this.getPathFromAncestors(field, ancestors);
    const errorPath = this.getDotNotationPathFromAncestors(field, ancestors);
    _set(this.model, valuePath, value);
    delete this.errors[errorPath];
    this.onModelUpdate(toJS(this.model));
  }

  @action addRepeaterRow(
    field: IField,
    rowIndex: number,
    ancestors?: IParent[]
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
    field: IField,
    rowIndex: number,
    ancestors?: IParent[]
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

  @action deleteErrorsForRow(field: IField, rowIndex: number) {
    Object.keys(this.errors)
      .filter(key => key.includes(`${field.key}.${rowIndex}.`))
      .forEach(errorKey => delete this.errors[errorKey]);
    return;
  }

  getValue = computedFn(function getValue(
    field: IField,
    ancestors?: IParent[]
  ) {
    const path = this.getPathFromAncestors(field, ancestors);

    if (ancestors) {
      return this.getLengthCheckedValue(path, ancestors);
    }
    const val = _get(this.model, path);

    return val;
  });

  getErrors = computedFn(function getErrors(
    field: IField,
    ancestors?: IParent[]
  ) {
    const path = this.getDotNotationPathFromAncestors(field, ancestors);
    return _get(this.errors, path);
  });

  getPathFromAncestors(field: IField, ancestors: IParent[] = []) {
    let path = ancestors.reduce((acc: string, ancestor: IParent) => {
      return `${acc}.${ancestor.field.key}[${ancestor.index}]`;
    }, "");
    return `${path}.${field.key}`.substr(1);
  }

  getDotNotationPathFromAncestors(field: IField, ancestors: IParent[] = []) {
    let path = ancestors.reduce((acc: string, ancestor: IParent) => {
      return `${acc}.${ancestor.field.key}.${ancestor.index}`;
    }, "");
    return `${path}.${field.key}`.substr(1);
  }

  getLengthCheckedValue(path: string, ancestors: IParent[]) {
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

  getBlankRepeaterRow(field: IField) {
    return field.subFields
      .flatMap((field: IField) => {
        if (field.input === "group") {
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

  getFieldName(field: IField) {
    let ucInput = field.input.charAt(0).toUpperCase() + field.input.slice(1);

    return this.allFieldInputs[ucInput + "Field"];
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

  toJS(value) {
    return value.toJS();
  }
}

export default createContext(new RootStore());
