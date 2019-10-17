import * as React from 'react';
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { IFieldProps } from '../interfaces/IFieldProps';
import { IField } from '../interfaces/IField';
import { FormLayout } from '@shopify/polaris';
import Store from '../stores/RootStore';

const Field = ({ field }: IFieldProps) => {
  const wrapperStyle = {
    marginTop: '-1.6rem',
    marginLeft: '-2rem'
  };

  const store = useContext(Store);

  return (
    <div style={wrapperStyle}>
      <FormLayout.Group condensed={field['condensed']}>
        {field.subFields.map((subField: IField, index: number) => {
          const Field = store.getFieldName(subField);
          return <Field field={subField} store={store} key={index} />;
        })}
      </FormLayout.Group>
    </div>
  );
};

export default observer(Field);
