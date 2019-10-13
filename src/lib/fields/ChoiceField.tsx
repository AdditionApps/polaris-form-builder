import * as React from 'react';
import { ChoiceList } from '@shopify/polaris';
import { IField } from '../IField';

interface IProps {
  field: IField;
  value: any;
  errors: string[] | false;
  onFieldUpdate: (key: string, newValue: boolean | string) => void;
  onFieldDirty: (key: string) => void;
}

export default function({
  field,
  value,
  errors,
  onFieldUpdate,
  onFieldDirty
}: IProps) {
  if (!Array.isArray(value)) {
    value = field.config.allowMultiple && value == null ? [] : [value];
  }

  const updateValue = newValue => {
    onFieldDirty(field.key);

    if (newValue.length === 0) {
      onFieldUpdate(field.key, null);

      return;
    }

    let value = field.config.allowMultiple ? newValue : newValue[0];

    onFieldUpdate(field.key, value);
  };

  const fieldProps = {
    selected: value,
    error: errors,
    onChange: newValue => updateValue(newValue),
    ...field.config
  };

  return <ChoiceList {...fieldProps} />;
}
