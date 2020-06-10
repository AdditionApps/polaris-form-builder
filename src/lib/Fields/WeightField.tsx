import React, { useRef } from "react";
import { TextField, TextFieldProps as PolarisTextFieldProps } from "@shopify/polaris";
import { Field, FieldProps } from "../Interfaces";
import { getValue, cleanString, getErrors } from '../Utils';

interface LocalField extends Field {
  config: PolarisTextFieldProps;
}

export interface TextFieldProps extends FieldProps {
  field: LocalField;
}

const convertFromGrams = (value, weightUnit) => {
  if (value == null || value === "") return null;

  switch (weightUnit) {
    case "kg":
      return (value / 1000).toString();
    case "lb":
      let lb = value * 0.00220462;
      return lb.toFixed(2).toString();
    case "oz":
      let oz = value * 0.035274;
      return oz.toFixed(2).toString();
    default:
      return value.toString();
  }
};

const convertToGrams = (value, weightUnit) => {
  if (value == null || value === "") return null;

  switch (weightUnit) {
    case "kg":
      return parseInt(String(value * 1000), 10);
    case "lb":
      return parseInt(String(value * 453.592), 10);
    case "oz":
      return parseInt(String(value * 28.35), 10);
    default:
      return parseInt(String(value), 10);
  }
};

export const WeightField = ({
  field,
  state,
  actions,
  ancestors
}: TextFieldProps) => {
  const value = getValue(state.model, field, ancestors);
  const valueFromGrams = convertFromGrams(value, state.units.weight)
  const valueRef = useRef(valueFromGrams);

  if(valueRef.current !== valueFromGrams){
    valueRef.current = valueFromGrams;
  }

  const updateField = (value: string) => {
    valueRef.current = cleanString(value);
    const updatedValue = value
      ? convertToGrams(parseFloat(cleanString(value)), state.units.weight)
      : null;
    actions.updateField(updatedValue, field, ancestors);
  };

  const fieldProps = {
    ...field.config,
    value: valueRef.current,
    error: getErrors(state.errors, field, ancestors),
    suffix: state.units.weight,
    label: field.config.label,
    onChange: (value: string) => updateField(value),
  };

  return <TextField {...fieldProps} />;
};
