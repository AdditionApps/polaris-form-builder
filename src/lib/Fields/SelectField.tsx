import React from "react";
import { Select, SelectProps as PolarisSelectProps } from "@shopify/polaris";
import _get from "lodash.get";
import { Field, FieldProps } from "../Interfaces";
import { getErrors, getValue } from '../Utils';

interface LocalField extends Field {
  config: PolarisSelectProps;
}

export interface SelectProps extends FieldProps {
  field: LocalField;
}

export const SelectField = ({
  field,
  state,
  actions,
  ancestors
}: SelectProps) => {
  let value = getValue(state.model, field, ancestors);

  if (value == null) {
    value = _get("field.config.options.0.value");
  }

  const fieldProps = {
    ...field.config,
    value,
    error: getErrors(state.errors, field, ancestors),
    label: field.config.label,
    onChange: (value: string) => {
      actions.updateField(value, field, ancestors);
    },
  };

  return <Select {...fieldProps} />;
};
