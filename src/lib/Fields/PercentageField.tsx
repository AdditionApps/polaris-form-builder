import React from "react";
import { useState, useRef } from "react";
import { TextField, TextFieldProps as PolarisTextFieldProps } from "@shopify/polaris";
import { Field, FieldProps, Units } from "../Interfaces";
import { getValue, cleanString, getErrors } from '../Utils';

interface LocalField extends Field {
  config: PolarisTextFieldProps;
}

export interface TextFieldProps extends FieldProps {
  field: LocalField;
}

const getFormatter = (units: Units) => {
  return new Intl.NumberFormat(units.locale, {
    style: "percent",
    maximumSignificantDigits: 3
  });
};

const toDecimal = (value: any) => {
  if (value == null || value === "") return null;

  return parseFloat((parseFloat(cleanString(value)) / 100).toFixed(4));
};

const fromDecimal = (value: any) => {
  if (value == null || value === "") return null;

  return (value * 100).toString();
};

export const PercentageField = ({
  field,
  state,
  actions,
  ancestors
}: TextFieldProps) => {
  const [focus, setFocus] = useState(false);
  const value = getValue(state.model, field, ancestors);
  const valueFromDecimal = fromDecimal(value)
  const valueRef = useRef(valueFromDecimal);

  if(valueRef.current !== valueFromDecimal){
    valueRef.current = valueFromDecimal;
  }

  const blurValue = valueRef.current
    ? getFormatter(state.units).format(value)
    : null;
  const formattedValue = focus ? valueRef.current : blurValue;

  const onFieldFocus = () => {
    setFocus(true);
  };

  const onFieldBlur = () => {
    setFocus(false);
  };

  const updateField = (value: string) => {
    valueRef.current = value;
    actions.updateField(toDecimal(value), field, ancestors);
  };

  const fieldProps = {
    ...field.config,
    value: formattedValue,
    error: getErrors(state.errors, field, ancestors),
    label: field.config.label,
    onChange: (value: string) => updateField(value),
    onFocus: () => onFieldFocus(),
    onBlur: () => onFieldBlur(),
  };

  return <TextField {...fieldProps} />;
};
