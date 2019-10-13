import * as React from 'react';
import { FormFieldGroup } from './../FormFieldGroup';
import { IField } from '../IField';
import { IUnits } from '../IUnits';
import { FormLayout } from '@shopify/polaris';

interface IProps {
  field: IField;
  value: string;
  units: IUnits;
  errors: object;
  onFieldUpdate: (key: string, newValue: string | number) => void;
  onFieldDirty: (key: string) => void;
}

export default function({
  field,
  value,
  units,
  errors,
  onFieldUpdate,
  onFieldDirty
}: IProps) {
  const wrapperStyle = {
    marginTop: '-1.6rem',
    marginLeft: '-2rem'
  };

  return (
    <div style={wrapperStyle}>
      <FormLayout.Group condensed>
        {field.subFields.map((field: IField, index: number) => {
          let fieldValue = value[field.key];

          return (
            <FormFieldGroup
              key={index}
              field={field}
              value={fieldValue}
              units={units}
              errors={errors}
              onFieldGroupUpdate={(key, newValue) =>
                onFieldUpdate(key, newValue)
              }
              onFieldGroupDirty={key => onFieldDirty(key)}
            />
          );
        })}
      </FormLayout.Group>
    </div>
  );
}
