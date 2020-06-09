import React from "react";
import { Checkbox, CheckboxProps as PolarisCheckboxProps } from "@shopify/polaris";
import { Field, FieldProps } from "../Interfaces";
import { getValue } from "../Utils";

interface LocalField extends Field {
  config: PolarisCheckboxProps;
}

export interface CheckboxProps extends FieldProps {
  field: LocalField;
}

export const CheckboxField = ({
  field,
  state,
  actions,
  ancestors
}: CheckboxProps) => {
  const fieldProps = {
    ...field.config,
    checked: getValue(state.model, field, ancestors),
    label: field.config.label,
    onChange: value => actions.updateField(value, field, ancestors),
  };

  return <Checkbox {...fieldProps} />;
};
