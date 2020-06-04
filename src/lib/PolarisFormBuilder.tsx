import * as React from 'react';
import { memo, useContext } from 'react';
import { Store } from './interfaces';
import StoreContext from './stores/RootStore';
import _isEqual from 'lodash.isequal';
import FieldContainer from './fields/components/FieldContainer';

const FormBuilder = (props: Store) => {

  const store = useContext(StoreContext);
  store.init(props);

  return (
    <StoreContext.Provider value={store}>
      <FieldContainer></FieldContainer>
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
