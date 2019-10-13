import * as React from 'react';
import { useState } from 'react';
import { TextField } from '@shopify/polaris';
import { IField } from '../IField';

interface IProps {
  field: IField;
  value: string;
  errors: string[] | false;
  onFieldUpdate: (key: string, newValue: string | number) => void;
  onFieldDirty: (key: string) => void;
}

export default function({
  field,
  value,
  errors,
  onFieldUpdate,
  onFieldDirty
}: IProps) {
  const [internalValue, setInternalValue] = useState(value);

  const fieldProps = {
    value: internalValue,
    error: errors,
    onChange: newValue => {
      setInternalValue(newValue);
      onFieldUpdate(field.key, newValue);
      onFieldDirty(field.key);
    },
    ...field.config
  };

  return <TextField {...fieldProps} />;
}
