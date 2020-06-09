import React, { useState, useRef } from "react";
import { TextField, TextFieldProps as PolarisTextFieldProps } from "@shopify/polaris";
import { Field, FieldProps, Units } from "../Interfaces";
import { getValue, cleanString } from "../Utils";

interface LocalField extends Field {
  config: PolarisTextFieldProps;
}

export interface TextFieldProps extends FieldProps {
  field: LocalField;
}

const getFormatter = (units: Units) => {
  return new Intl.NumberFormat(units.locale, {
    style: "currency",
    currency: units.currency
  });
};

const getFormatData = (units: Units) => {
  return getFormatter(units).resolvedOptions();
};

const getMultiplier = (units: Units) => {
  const formatData = getFormatData(units);
  return 10 ** formatData.minimumFractionDigits;
};

const getFloatValue = (value?: string) => {
  return value ? parseFloat(cleanString(value)) : null;
};

export const MoneyField = ({
  field,
  state,
  actions,
  ancestors
}: TextFieldProps) => {
  const [focus, setFocus] = useState(false);
  const multiplier = getMultiplier(state.units);
  const formatData = getFormatData(state.units);
  const value = getValue(state.model, field, ancestors);
  const focusValue = value ? String(value / multiplier) : null;
  const valueRef = useRef<string | null>(focusValue);

  if(valueRef.current !== focusValue){
    valueRef.current = focusValue;
  }

  const blurValue = value
    ? getFormatter(state.units).format(
        getFloatValue(getFloatValue(valueRef.current).toFixed(
          formatData.minimumFractionDigits
        ))
      )
    : null;

  const formattedValue = focus ? valueRef.current : blurValue;

  const onFieldFocus = () => {
    setFocus(true);
  };

  const onFieldBlur = () => {
    setFocus(false);
  };

  const updateField = (value: string) => {
    valueRef.current = value ? cleanString(value) : null;

    const floatValue = getFloatValue(value);

    if (!floatValue || isNaN(floatValue)) {
      actions.updateField(null, field, ancestors);
      return;
    }

    const lowestDenominatorValue = multiplier * floatValue;
    const updatedValue = parseInt(
      lowestDenominatorValue.toFixed(formatData.minimumFractionDigits),
      10
    );

    actions.updateField(updatedValue, field, ancestors);
  };

  const fieldProps = {
    ...field.config,
    value: formattedValue,
    label: field.config.label,
    onChange: (value: string) => updateField(value),
    onFocus: () => onFieldFocus(),
    onBlur: () => onFieldBlur(),
  };

  return <TextField {...fieldProps} />;
};
