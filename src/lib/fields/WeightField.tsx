import * as React from 'react';
import { useState } from 'react';
import { TextField } from '@shopify/polaris';
import { IField } from '../IField';
import { IUnits } from '../IUnits';

interface IProps {
  field: IField;
  value: number;
  units: IUnits;
  errors: string[] | false;
  onFieldUpdate: (key: string, newValue: number) => void;
  onFieldDirty: (key: string) => void;
}

const convertFromGrams = (value, weightUnit) => {
  if (value == null || value === '') return null;

  switch (weightUnit) {
    case 'kg':
      return value / 1000;
    case 'lb':
      let lb = value * 0.00220462;
      return lb.toFixed(2);
    case 'oz':
      let oz = value * 0.035274;
      return oz.toFixed(2);
    default:
      return value;
  }
};

const convertToGrams = (value, weightUnit) => {
  if (value == null || value === '') return null;

  switch (weightUnit) {
    case 'kg':
      return parseInt(String(value * 1000));
    case 'lb':
      return parseInt(String(value * 453.592));
    case 'oz':
      return parseInt(String(value * 28.35));
    default:
      return parseInt(String(value));
  }
};

export default function({
  field,
  value,
  units,
  errors,
  onFieldUpdate,
  onFieldDirty
}: IProps) {
  const weightUnit = units.hasOwnProperty('weight') ? units.weight : 'kg';

  const [internalValue, setInternalValue] = useState(
    convertFromGrams(value, weightUnit)
  );

  const onFieldBlur = () => {
    onFieldUpdate(field.key, convertToGrams(internalValue, weightUnit));
  };

  const updateField = newValue => {
    setInternalValue(newValue);
  };

  const fieldProps = {
    value: internalValue,
    type: 'text',
    suffix: weightUnit,
    error: errors,
    onChange: newValue => {
      updateField(newValue);
      onFieldDirty(field.key);
    },
    onBlur: () => onFieldBlur(),
    ...field.config
  };

  return <TextField {...fieldProps} />;
}
