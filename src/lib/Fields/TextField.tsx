import React from "react";
import { TextField as PolarisTextField, TextFieldProps as PolarisTextFieldProps } from "@shopify/polaris";
import { Field, FieldProps } from "../Interfaces";
import { getValue, getErrors } from "../Utils";

interface LocalField extends Field {
  config: PolarisTextFieldProps;
}

export interface TextFieldProps extends FieldProps {
  field: LocalField;
}

export const TextField = ({
  field,
  state,
  actions,
  ancestors
}: TextFieldProps) => {
  const fieldProps = {
    ...field.config,
    value: getValue(state.model, field, ancestors),
    error: getErrors(state.errors, field, ancestors),
    label: field.config.label,
    onChange: (value: string) => actions.updateField(value, field, ancestors),
  };

  return <PolarisTextField {...fieldProps} />;
};
