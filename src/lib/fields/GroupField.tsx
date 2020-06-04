import * as React from 'react';
import { useContext } from 'react';
// import { observer } from 'mobx-react-lite';
import { FormFieldProps } from '../interfaces/FormFieldProps';
import { FormField } from '../interfaces/FormField';
import { FormLayout } from '@shopify/polaris';
import Store from '../stores/RootStore';
import shortid from 'shortid';

const Field = ({ field, ancestors }: FormFieldProps) => {
  const wrapperStyle = {
    marginTop: '-1.6rem',
    marginLeft: '-2rem'
  };

  const store = useContext(Store);

  const subfieldMarkup = field.subFields.map((subField: FormField) => {
    const Field = store.getFieldName(subField);
    return <Field field={subField} ancestors={ancestors} key={shortid.generate()} />;
  });

  return (
    <div style={wrapperStyle}>
      <FormLayout.Group condensed={field['condensed']}>
        {subfieldMarkup}
      </FormLayout.Group>
    </div>
  );
};

export default Field;
