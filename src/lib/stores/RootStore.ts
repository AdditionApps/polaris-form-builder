import { createContext } from 'react';
import { toJS, observable, action } from 'mobx';
import { computedFn } from 'mobx-utils';
import { IStore } from '../interfaces/IStore';
import { IField } from '../interfaces/IField';
import { IParent } from '../interfaces/IParent';
import { IUnits } from '../interfaces/IUnits';
import * as fieldInputs from '../fields';

export class RootStore {
  @observable model = {};
  @observable errors = {};
  @observable units: IUnits = {};
  onModelUpdate;
  fields;

  @action init({ fields, model, errors, units, onModelUpdate }: IStore) {
    this.fields = fields;
    this.model = model;
    this.errors = errors;
    this.units = units;
    this.onModelUpdate = onModelUpdate;
  }

  @action updateModelField(key: string, value: any) {
    value = value || value === 0 || value === false ? value : null;
    this.model[key] = value;
    delete this.errors[key];
    this.onModelUpdate(toJS(this.model));
  }

  @action updateModelSubField(
    parentKey: string,
    index: number,
    subFieldKey: string,
    value: any
  ) {
    value = value || value === 0 || value === false ? value : null;
    this.model[parentKey][index][subFieldKey] = value;
    delete this.errors[`${parentKey}.${index}.${subFieldKey}`];
    this.onModelUpdate(toJS(this.model));
  }

  @action addRepeaterRow(field: IField, rowIndex: number) {
    const blankRow = this.getBlankRepeaterRow(field);
    if (this.model[field.key] == null || this.model[field.key].length === 0) {
      this.model[field.key] = [blankRow];
      this.onModelUpdate(toJS(this.model));
      return;
    }
    this.model[field.key].splice(rowIndex + 1, 0, blankRow);
    this.onModelUpdate(toJS(this.model));
  }

  @action removeRepeaterRow(field: IField, rowIndex: number) {
    if (this.model[field.key].length === 1) {
      this.model[field.key] = null;
      this.deleteSubFieldError(field);
      this.onModelUpdate(toJS(this.model));
      return;
    }

    this.model[field.key].splice(rowIndex, 1);
    this.deleteSubFieldError(field, rowIndex);
    this.onModelUpdate(toJS(this.model));
  }

  @action deleteSubFieldError(field: IField, rowIndex: number = null) {
    if (rowIndex || rowIndex === 0) {
      Object.keys(this.errors)
        .filter(key => key.startsWith(`${field.key}.${rowIndex}.`))
        .forEach(errorKey => delete this.errors[errorKey]);
      return;
    }
    Object.keys(this.errors)
      .filter(key => key.startsWith(`${field.key}.`))
      .forEach(errorKey => delete this.errors[errorKey]);
  }

  updateValue(value, field: IField, parent: IParent = null) {
    if (parent) {
      this.updateModelSubField(
        parent.field.key,
        parent.index,
        field.key,
        value
      );
      return;
    }
    this.updateModelField(field.key, value);
  }

  getValue = computedFn(function getValue(field: IField, parent: IParent) {
    if (parent) {
      if (this.model[parent.field.key].length >= parent.index + 1) {
        return this.model[parent.field.key][parent.index][field.key];
      }
      return;
    }
    return this.model[field.key];
  });

  getErrors = computedFn(function getErrors(field: IField, parent: IParent) {
    if (parent) {
      return this.errors[`${parent.field.key}.${parent.index}.${field.key}`];
    }
    return this.errors[field.key];
  });

  getBlankRepeaterRow(field: IField) {
    return field.subFields
      .map((field: IField) => {
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

    return fieldInputs[ucInput + 'Field'];
  }
}

export default createContext(new RootStore());
