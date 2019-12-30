import * as React from 'react';
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { FormLayout, Button, Stack } from '@shopify/polaris';
import { CirclePlusMajorMonotone } from '@shopify/polaris-icons';
import { FormUnits } from '../../interfaces/FormUnits';
import { FormFieldParent } from '../../interfaces/FormFieldParent';
import Store from '../../stores/RootStore';
import _cloneDeep from 'lodash.clonedeep';
const shortid = require('shortid');

interface IProps {
  field: FormUnits;
  ancestors?: FormFieldParent[];
  index: number;
}

const Row = ({ field, ancestors, index }: IProps) => {
  const store = useContext(Store);

  const wrapperStyle = {
    marginTop: '-1.6rem',
    marginLeft: '-2rem'
  };

  const controlStyle = {
    marginTop: '1rem',
    marginBottom: '2rem'
  };

  const updatedAncestors = ancestors ? _cloneDeep(ancestors) : [];

  updatedAncestors.push({ field, index });

  const fields = field.subFields.map((subField: FormField) => {
    const Field = store.getFieldName(subField);
    const id = shortid.generate();
    return <Field field={subField} ancestors={updatedAncestors} key={id} />;
  });

  const getFieldLayout = () => {
    switch (field.layout) {
      case 'stacked':
        return <FormLayout>{fields}</FormLayout>;
      case 'grouped':
        return (
          <div style={wrapperStyle}>
            <FormLayout.Group>{fields}</FormLayout.Group>
          </div>
        );
      case 'condensed':
        return (
          <div style={wrapperStyle}>
            <FormLayout.Group condensed>{fields}</FormLayout.Group>
          </div>
        );
      default:
        return <FormLayout>{fields}</FormLayout>;
    }
  };

  return (
    <div>
      {getFieldLayout()}
      <div style={controlStyle}>
        <Stack>
          <Stack.Item fill>
            <Button
              plain
              icon={CirclePlusMajorMonotone}
              onClick={() => store.addRepeaterRow(field, index, ancestors)}
            >
              {field.addButtonText ? field.addButtonText : 'Add row'}
            </Button>
          </Stack.Item>
          <Stack.Item>
            <Button
              plain
              destructive
              onClick={() => store.removeRepeaterRow(field, index, ancestors)}
            >
              Remove
            </Button>
          </Stack.Item>
        </Stack>
      </div>
    </div>
  );
};

export default observer(Row);
