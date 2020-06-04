import * as React from 'react';
import { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { FormField } from '../../interfaces/FormField';
import { FormFieldParent } from '../../interfaces/FormFieldParent';
import RepeaterRow from './RepeaterRow';
import Store from '../../stores/RootStore';
import shortid from 'shortid';

interface IProps {
  field: FormField;
  ancestors?: FormFieldParent[];
}

const Rows = ({ field, ancestors }: IProps) => {
  const store = useContext(Store);
  const rows = store.getValue(field, ancestors);

  return rows.map((row: object, index: number) => {
    return (
      <RepeaterRow field={field} ancestors={ancestors} index={index} key={shortid.generate()} />
    );
  });
};

export default observer(Rows);
