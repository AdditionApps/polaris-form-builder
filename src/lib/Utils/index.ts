import _get from "lodash.get";
import _cloneDeep from "lodash.clonedeep";
import LocaleCurrency from "locale-currency";
import { Field, FieldParent, Units } from '../Interfaces';
import * as fieldInputs from "../Fields";

export const buildPatchFromAncestors = (
  value: any,
  field: Field,
  ancestors: FieldParent[] = []
) => {
  return ancestors.reverse().reduce(
    (acc: object, ancestor: FieldParent) => {
      return {
        [ancestor.field.key]: {
          [ancestor.index]: acc
        }
      };
    },
    { [field.key]: value }
  );
};

export const getPathFromAncestors = (
  field: Field,
  ancestors: FieldParent[] = []
) => {
  const path = ancestors.reduce((acc: string, ancestor: FieldParent) => {
    return `${acc}.${ancestor.field.key}.${ancestor.index}`;
  }, "");
  return `${path}.${field.key}`.substr(1);
};

export const getValue = (
  model: object,
  field: Field,
  ancestors: FieldParent[] = []
) => {
  const value = _get(model, getPathFromAncestors(field, ancestors));

  if (
    value &&
    ["text", "money", "weight", "percentage"].includes(field.input)
  ) {
    return value.toString();
  }

  return value;
};

export const getErrors = (
  errors: object,
  field: Field,
  ancestors?: FieldParent[]
) => {
  return _get(errors, getPathFromAncestors(field, ancestors));
};

export const getBlankRepeaterRow = (field: Field) => {
  return field.subFields
    .flatMap((field: Field) => {
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
};

export const transformFields = (
  fields: Field[],
  callback: (field: Field) => Field
) => {
  return fields.map((field: Field) => {
    return _cloneDeep(callback(field));
  });
};

export const setupInputs = (customFields: Field[]) => {
  const mappedCustomFields = customFields.reduce((fields, field) => {
    fields[field['name']] = field;
    return fields;
  }, {});

  return { ...mappedCustomFields, ...fieldInputs };
};

export const getFieldName = (field: Field, inputs: Field[]) => {
  const inputName = field.input
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  return inputs[inputName + "Field"];
};

export const cleanString = value => {
  return String(value).replace(/[^0-9.]/g, "");
};

export const getLocale = (units?: Units) => {
  return units && units.hasOwnProperty("locale")
    ? units.locale
    : navigator.language;
};

export const getCurrency = (units?: Units) => {
  return units && units.hasOwnProperty("currency")
    ? units.currency
    : LocaleCurrency.getCurrency(getLocale(units));
};

export const setupUnits = (units?: Units) => {
  return {
    locale: getLocale(units),
    currency: getCurrency(units),
    weight: units && units.hasOwnProperty("weight") ? units.weight : "g"
  };
};
