import * as React from 'react';
import { useState, useEffect } from 'react';
import { FormFieldGroup } from './FormFieldGroup';
import { IField } from './IField';
import { IUnits } from './IUnits';
import { FormLayout } from '@shopify/polaris';

interface IProps {
  fields: IField[];
  model: any;
  units: IUnits;
  errors: object;
  onModelUpdate: (model: any) => void;
}

export function PolarisFormBuilder({
  fields,
  model,
  units,
  errors,
  onModelUpdate
}: IProps) {
  const [modelState, setModelState] = useState(model);
  const [errorState, setErrorState] = useState(errors);

  useEffect(() => {
    onModelUpdate(modelState);
  });

  useEffect(() => {
    setErrorState(errors);
  }, [errors]);

  const getValue = field => {
    if (field.input === 'group') {
      const subFieldKeys = field.subFields.map(field => field.key);

      return Object.keys(model)
        .filter(key => subFieldKeys.includes(key))
        .reduce((obj, key) => {
          obj[key] = model[key];
          return obj;
        }, {});
    }

    return model[field['key']];
  };

  return (
    <FormLayout>
      {fields.map((field: IField, index: number) => {
        let value = getValue(field);

        return (
          <FormFieldGroup
            key={index}
            field={field}
            value={value}
            units={units}
            errors={errorState}
            onFieldGroupUpdate={(key, value) =>
              setModelState({ ...modelState, [key]: value })
            }
            onFieldGroupDirty={errorKey => {
              let filteredErrors = Object.keys(errorState)
                .filter(key => key !== errorKey)
                .reduce((obj, key) => {
                  obj[key] = errorState[key];
                  return obj;
                }, {});
              setErrorState(filteredErrors);
            }}
          />
        );
      })}
    </FormLayout>
  );
}
