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
  onFieldUpdate: (key: string, newValue: string | number) => void;
  onFieldDirty: (key: string) => void;
}

const getLocale = units => {
  return units && units.hasOwnProperty('locale')
    ? units.locale
    : navigator.language;
};

const getFormatter = units => {
  return new Intl.NumberFormat(getLocale(units), {
    style: 'percent',
    maximumSignificantDigits: 3
  });
};

const stripValue = value => {
  return String(value).replace(/[^0-9.]/g, '');
};

const toDecimal = value => {
  if (value == null || value === '') return null;

  let val = String(value).replace(/[^0-9.]/g, '');

  return parseFloat(val) / 100;
};

const fromDecimal = value => {
  if (value == null || value === '') return null;

  return value * 100;
};

export default function({
  field,
  value,
  units,
  errors,
  onFieldUpdate,
  onFieldDirty
}: IProps) {
  const [internalValue, setInternalValue] = useState<string>(
    String(fromDecimal(value))
  );
  const [focus, setFocus] = useState(false);

  const blurValue = value
    ? getFormatter(units).format(toDecimal(internalValue))
    : null;
  const formattedValue = focus ? internalValue : blurValue;

  const onFieldFocus = () => {
    setFocus(true);
  };

  const onFieldBlur = () => {
    onFieldUpdate(field.key, toDecimal(internalValue));
    setFocus(false);
  };

  const updateField = newValue => {
    onFieldDirty(field.key);
    setInternalValue(stripValue(newValue));
  };

  const fieldProps = {
    value: formattedValue,
    type: 'currency',
    error: errors,
    onChange: newValue => updateField(newValue),
    onFocus: () => onFieldFocus(),
    onBlur: () => onFieldBlur(),
    ...field.config
  };

  return <TextField {...fieldProps} />;
}
