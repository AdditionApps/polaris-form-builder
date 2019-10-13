import * as React from 'react';
import { FormFieldGroup } from './../FormFieldGroup';
import { IField } from '../IField';
import { IUnits } from '../IUnits';
import {
  FormLayout,
  Subheading,
  TextContainer,
  Button,
  Stack
} from '@shopify/polaris';
import { CirclePlusMajorMonotone } from '@shopify/polaris-icons';

interface IProps {
  field: IField;
  value?: object[];
  units: IUnits;
  errors: object;
  onFieldUpdate: (key: string, newValue: object[]) => void;
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
  const controlsStyle = {
    marginTop: '1rem'
  };

  const updateSubRowField = (key: string, newValue: any, rowIndex: number) => {
    let row = value[rowIndex];

    if (row.hasOwnProperty(key)) {
      row[key] = newValue;
    }

    value.splice(rowIndex, 1, row);

    onFieldUpdate(field.key, value);
  };

  const fields = (row, rowIndex) => {
    return (
      <div style={wrapperStyle}>
        <FormLayout.Group condensed={field.config.condensed}>
          {field.subFields.map((subfield: IField, index: number) => {
            let fieldValue = row[subfield.key];
            let subfieldErrors = {};

            if (errors.hasOwnProperty(`${rowIndex}.${subfield.key}`)) {
              subfieldErrors = Object.keys(errors)
                .filter(key => {
                  let parts = key.split('.');

                  return parseInt(parts[0]) === rowIndex;
                })
                .reduce((obj, key) => {
                  let parts = key.split('.');
                  obj[parts[1]] = errors[key];

                  return obj;
                }, {});
            }

            return (
              <FormFieldGroup
                key={index}
                field={subfield}
                value={fieldValue}
                units={units}
                errors={subfieldErrors}
                onFieldGroupUpdate={(key, newValue) =>
                  updateSubRowField(key, newValue, rowIndex)
                }
                onFieldGroupDirty={key => {
                  let errorKey = `${field.key}.${rowIndex}.${key}`;
                  onFieldDirty(errorKey);
                }}
              />
            );
          })}
        </FormLayout.Group>
      </div>
    );
  };

  const makeBlankRow = () => {
    return field.subFields
      .map((field: IField) => {
        return {
          key: field.key,
          value: field.defaultValue || null
        };
      })
      .reduce((obj, field) => {
        obj[field.key] = field.value;
        return obj;
      }, {});
  };

  const addRow = rowIndex => {
    value.splice(rowIndex + 1, 0, makeBlankRow());

    onFieldUpdate(field.key, value);
  };

  const removeRow = rowIndex => {
    value.splice(rowIndex, 1);

    onFieldUpdate(field.key, value);
  };

  if (value == null || value.length === 0) {
    value = [makeBlankRow()];
  }

  const rows = value.map((row: object, rowIndex: number) => {
    return (
      <div key={rowIndex}>
        {fields(row, rowIndex)}
        <div style={controlsStyle}>
          <Stack>
            <Stack.Item fill>
              <Button
                plain
                icon={CirclePlusMajorMonotone}
                onClick={() => addRow(rowIndex)}
              >
                Add row
              </Button>
            </Stack.Item>
            <Stack.Item>
              <Button plain destructive onClick={() => removeRow(rowIndex)}>
                Delete row
              </Button>
            </Stack.Item>
          </Stack>
        </div>
      </div>
    );
  });

  return (
    <TextContainer spacing="tight">
      {field.config.title && (
        <Subheading element="p">{field.config.title}</Subheading>
      )}
      {rows}
    </TextContainer>
  );
}
