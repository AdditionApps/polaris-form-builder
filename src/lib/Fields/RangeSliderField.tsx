import React from "react";
import { RangeSlider, RangeSliderProps as PolarisRangeSliderProps } from "@shopify/polaris";
import { Field, FieldProps } from "../Interfaces";
import { getErrors, getValue } from '../Utils';

interface LocalField extends Field {
  config: PolarisRangeSliderProps;
}

export interface RangeSliderProps extends FieldProps {
  field: LocalField;
}

export const RangeSliderField = ({
  field,
  state,
  actions,
  ancestors
}: RangeSliderProps) => {
  let value = getValue(state.model, field, ancestors);

  const fieldProps = {
    ...field.config,
    value: value,
    error: getErrors(state.errors, field, ancestors),
    label: field.config.label,
    onChange: value => actions.updateField(value, field, ancestors),
  };

  return <RangeSlider {...fieldProps} />;
};
