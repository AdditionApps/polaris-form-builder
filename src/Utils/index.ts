import _get from 'lodash.get';
import _cloneDeep from 'lodash.clonedeep';
import LocaleCurrency from 'locale-currency';
import {
  Field,
  FieldParent,
  FieldProps,
  ModelValue,
  MappedFields,
  Units, ErrorValue
} from '../Interfaces';
import * as fieldInputs from '../Fields';
import { FunctionComponent } from 'react';

export const buildPatchFromAncestors = (
    value: ModelValue,
    field: Field,
    ancestors: FieldParent[] = [],
) => {
    return ancestors.reverse().reduce(
        (acc: Record<string, ModelValue>, ancestor: FieldParent) => {
            return {
                [ancestor.field.key]: {
                    [ancestor.index]: acc,
                },
            };
        },
        { [field.key]: value },
    );
};

export const getPathFromAncestors = (
    field: Field,
    ancestors: FieldParent[] = [],
) => {
    const path = ancestors.reduce((acc: string, ancestor: FieldParent) => {
        return `${acc}.${ancestor.field.key}.${ancestor.index}`;
    }, '');
    return `${path}.${field.key}`.substr(1);
};

export const getValue = (
    model: Record<string, ModelValue>,
    field: Field,
    ancestors: FieldParent[] = [],
): ModelValue => {
    const value = _get(model, getPathFromAncestors(field, ancestors));

    if (
        value &&
        ['text', 'money', 'weight', 'percentage'].includes(field.input)
    ) {
        return String(value);
    }

    return value;
};

export const getErrors = (
    errors: Record<string, ErrorValue>,
    field: Field,
    ancestors?: FieldParent[],
) => {
    return _get(errors, getPathFromAncestors(field, ancestors));
};

export const getBlankRepeaterRow = (field: Field) => {
    return field.subFields
        ? field.subFields
              .flatMap((field: Field) => {
                  if (field.input === 'group') {
                      return field.subFields
                          ? field.subFields.map((subField) => {
                                return {
                                    key: subField.key,
                                    value: subField.defaultValue || null,
                                };
                            })
                          : [];
                  }
                  return {
                      key: field.key,
                      value: field.defaultValue || null,
                  };
              })
              .reduce((obj: Record<string, ModelValue>, field) => {
                  obj[field.key] = field.value;
                  return obj;
              }, {})
        : [];
};

export const transformFields = (
    fields: Field[],
    callback: (field: Field) => Field,
) => {
    return fields.map((field: Field) => {
        return _cloneDeep(callback(field));
    });
};

export const setupInputs = (
    customFields: FunctionComponent[],
): MappedFields => {
    const mappedCustomFields = customFields.reduce(
        (fields: MappedFields, field) => {
            fields[field['name']] = field;
            return fields;
        },
        {},
    );

    return { ...mappedCustomFields, ...fieldInputs } as MappedFields;
};

export const getFieldName = (
    field: Field,
    inputs: MappedFields,
): FunctionComponent<FieldProps> => {
    const inputName: string = field.input
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

    return inputs[`${inputName}Field`];
};

export const cleanString = (value: string | number) => {
    return String(value).replace(/[^0-9.]/g, '');
};

export const getLocale = (units?: Units) => {
    return units && units.hasOwnProperty('locale')
        ? units.locale
        : navigator.language;
};

export const getCurrency = (units?: Units) => {
    return units && units.hasOwnProperty('currency')
        ? units.currency
        : LocaleCurrency.getCurrency(getLocale(units) || 'en-US');
};

export const setupUnits = (units?: Units) => {
    return {
        locale: getLocale(units),
        currency: getCurrency(units),
        weight: units && units.hasOwnProperty('weight') ? units.weight : 'g',
    };
};
