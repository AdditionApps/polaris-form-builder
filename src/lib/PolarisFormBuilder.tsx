import * as React from 'react';
import { memo, useContext } from 'react';
import { FormField } from './interfaces/FormField';
import { Store } from './interfaces/Store';
import { FormLayout } from '@shopify/polaris';
import StoreContext from './stores/RootStore';
import _isEqual from 'lodash.isequal';

const FormBuilder = (props: Store) => {
  const store = useContext(StoreContext);
  store.init(props);

  return (
    <StoreContext.Provider value={store}>
      <FormLayout>
        {props.fields.map((field: FormField, index: number) => {
          const Field = store.getFieldName(field);

          return <Field field={field} key={index} />;
        })}
      </FormLayout>
    </StoreContext.Provider>
  );
};

const propsEqual = (prev, next) => {
  return (
    _isEqual(prev.fields, next.fields) &&
    _isEqual(prev.units, next.units) &&
    _isEqual(prev.errors, next.errors)
  );
};

export const PolarisFormBuilder = memo(FormBuilder, propsEqual);
