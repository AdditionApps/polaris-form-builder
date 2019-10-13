import * as React from "react";
import { Select } from "@shopify/polaris";
import { IField } from "../IField";

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
  if (value == null) {
    value = field.config.options[0].value;
  }

  const fieldProps = {
    value: value,
    error: errors,
    onChange: newValue => {
      onFieldUpdate(field.key, newValue);
      onFieldDirty(field.key);
    },
    ...field.config
  };

  return <Select {...fieldProps} />;
}
