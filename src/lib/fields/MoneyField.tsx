import * as React from 'react';
import { useState } from 'react';
import { TextField } from '@shopify/polaris';
import { IField } from '../IField';
import { IUnits } from '../IUnits';
const LocaleCurrency = require('locale-currency');

interface IProps {
  field: IField;
  value: any;
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

const getCurrency = units => {
  return units && units.hasOwnProperty('currency')
    ? units.currency
    : LocaleCurrency.getCurrency(getLocale(units));
};

const getFormatter = units => {
  return new Intl.NumberFormat(getLocale(units), {
    style: 'currency',
    currency: getCurrency(units)
  });
};

const getMultiplier = units => {
  const formatData = getFormatter(units).resolvedOptions();
  return 10 ** formatData.minimumFractionDigits;
};

const getFloatValue = (value: string) => {
  let val = value.replace(/[^0-9.]/g, '');
  return parseFloat(val);
};

export default function({
  field,
  value,
  units,
  errors,
  onFieldUpdate,
  onFieldDirty
}: IProps) {
  const multiplier = getMultiplier(units);
  const focusValue = value ? String(value / multiplier) : null;

  const [focus, setFocus] = useState(false);
  const [internalValue, setInternalValue] = useState<string | null>(focusValue);

  const blurValue = value
    ? getFormatter(units).format(getFloatValue(internalValue))
    : null;

  const formattedValue = focus ? internalValue : blurValue;

  const onFieldFocus = () => {
    setFocus(true);
  };

  const onFieldBlur = () => {
    onFieldUpdate(
      field.key,
      parseInt(String(getFloatValue(String(internalValue)) * multiplier))
    );
    setFocus(false);
  };

  const updateField = newValue => {
    setInternalValue(String(newValue));
    onFieldDirty(field.key);
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
