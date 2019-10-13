import * as React from "react";
import * as fields from "./fields";
import { IField } from "./IField";
import { IUnits } from "./IUnits";

interface IProps {
  field: IField;
  value: any;
  units: IUnits;
  errors: any;
  onFieldGroupUpdate: (key: string, newValue: any) => void;
  onFieldGroupDirty: (key: string) => void;
}

const getFieldName = input => {
  let ucInput = input.charAt(0).toUpperCase() + input.slice(1);

  return fields[ucInput + "Field"];
};

const getErrors = (errors, field: IField) => {
  switch (field.input) {
    case "group":
      const subFieldKeys = field.subFields.map(field => field.key);

      return Object.keys(errors)
        .filter(key => subFieldKeys.includes(key))
        .reduce((obj, key) => {
          obj[key] = errors[key];
          return obj;
        }, {});
    case "repeater":
      return Object.keys(errors)
        .filter(error => {
          let parts = error.split(".");
          return parts.length > 1 && parts[0] === field.key;
        })
        .reduce((obj, key) => {
          let subFeldErrors = errors[key];
          let parts = key.split(".");
          parts.splice(0, 1);
          let truncatedKey = parts.join(".");
          obj[truncatedKey] = subFeldErrors;
          return obj;
        }, {});
    default:
      return errors.hasOwnProperty(field.key) ? errors[field.key] : false;
  }
};

export function FormFieldGroup({
  field,
  value,
  units,
  errors,
  onFieldGroupUpdate,
  onFieldGroupDirty
}: IProps) {
  let Field = getFieldName(field.input);
  if (value == null && field.hasOwnProperty("defaultValue")) {
    value = field.defaultValue;
    onFieldGroupUpdate(field.key, value);
  }
  return (
    <Field
      field={field}
      value={value}
      units={units}
      errors={getErrors(errors, field)}
      onFieldUpdate={(key, newValue) => onFieldGroupUpdate(key, newValue)}
      onFieldDirty={key => onFieldGroupDirty(key)}
    />
  );
}
