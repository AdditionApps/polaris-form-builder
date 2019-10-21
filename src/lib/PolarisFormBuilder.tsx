import * as React from 'react';
import { memo, useContext } from 'react';
import { IField } from './interfaces/IField';
import { IStore } from './interfaces/IStore';
import { FormLayout } from '@shopify/polaris';
import StoreContext from './stores/RootStore';
import isEqual from 'lodash.isequal';

const FormBuilder = (props: IStore) => {
  const store = useContext(StoreContext);
  store.init(props);

  return (
    <StoreContext.Provider value={store}>
      <FormLayout>
        {props.fields.map((field: IField, index: number) => {
          const Field = store.getFieldName(field);

          return <Field field={field} key={index} />;
        })}
      </FormLayout>
    </StoreContext.Provider>
  );
};

const propsEqual = (prev, next) => {
  return (
    isEqual(prev.fields, next.fields) &&
    isEqual(prev.units, next.units) &&
    isEqual(prev.errors, next.errors)
  );
};

export const PolarisFormBuilder = memo(FormBuilder, propsEqual);
