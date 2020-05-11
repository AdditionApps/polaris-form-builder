import * as React from 'react';
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { TextField } from '@shopify/polaris';
import { FormFieldProps } from '../interfaces/FormFieldProps';
import Store from '../stores/RootStore';

const Field = ({ field, ancestors }: FormFieldProps) => {
  const store = useContext(Store);

  const fieldProps = {
    value: store.getValue(field, ancestors),
    error: store.getErrors(field, ancestors),
    label: field.config['label'],
    onChange: value => store.updateValue(value, field, ancestors),
    ...field.config
  };

  return <TextField {...fieldProps} />;
};

export default observer(Field);
