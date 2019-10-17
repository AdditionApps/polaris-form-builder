import * as React from 'react';
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { TextField } from '@shopify/polaris';
import { IFieldProps } from '../interfaces/IFieldProps';
import Store from '../stores/RootStore';

const Field = ({ field, parent }: IFieldProps) => {
  const store = useContext(Store);

  const fieldProps = {
    value: store.getValue(field, parent),
    error: store.getErrors(field, parent),
    label: field.config['label'],
    onChange: value => store.updateValue(value, field, parent),
    ...field.config
  };

  return <TextField {...fieldProps} />;
};

export default observer(Field);
