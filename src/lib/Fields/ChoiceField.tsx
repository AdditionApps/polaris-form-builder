import React from "react";
import { ChoiceList, ChoiceListProps as PolarisChoiceListProps } from "@shopify/polaris";
import { Field, FieldProps } from "../Interfaces";
import { getValue } from "../Utils";

interface LocalField extends Field {
  config: PolarisChoiceListProps;
}

export interface ChoiceListProps extends FieldProps {
  field: LocalField;
}

export const ChoiceField = ({
  field,
  state,
  actions,
  ancestors
}: ChoiceListProps) => {
  let value = getValue(state.model, field, ancestors);

  if (!Array.isArray(value)) {
    value = field.config.allowMultiple && value === null ? [] : [value];
  }

  const updateValue = (newValue: string) => {
    let value;
    if (newValue.length === 0) {
      value = null;
    } else {
      value = field.config.allowMultiple ? newValue : newValue[0];
    }

    actions.updateField(value, field, ancestors);
  };

  const fieldProps = {
    ...field.config,
    selected: value,
    title: field.config.title,
    choices: field.config.choices,
    onChange: value => updateValue(value),
  };

  return <ChoiceList {...fieldProps} />;
};
