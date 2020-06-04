import * as React from 'react';
import { useContext } from 'react';
import { FormField } from '../../interfaces';
import { FormLayout } from '@shopify/polaris';
import { observer } from 'mobx-react-lite';
import Store from '../../stores/RootStore';
import shortid from 'shortid';

const FieldContainer = () => {
  const store = useContext(Store);

  return (
    <FormLayout>
      {store.fields.length > 0 && store.fields.map((field: FormField) => {
        const Field = store.getFieldName(field);
        return <Field field={field} key={shortid.generate()} />;
      })}
    </FormLayout>
  );
};

export default observer(FieldContainer);
