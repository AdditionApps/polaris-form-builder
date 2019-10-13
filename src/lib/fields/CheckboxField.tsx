import * as React from "react";
import { Checkbox } from "@shopify/polaris";
import { IField } from "../IField";

interface IProps {
  field: IField;
  value: string;
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
  const fieldProps = {
    checked: value,
    error: errors,
    onChange: newValue => {
      onFieldUpdate(field.key, newValue);
      onFieldDirty(field.key);
    },
    ...field.config
  };

  return <Checkbox {...fieldProps} />;
}
