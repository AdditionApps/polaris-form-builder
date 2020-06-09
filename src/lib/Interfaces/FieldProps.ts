import { Actions, Field, FieldParent } from '.';

export interface FieldProps {
  field: Field;
  state: any;
  actions: Actions;
  ancestors?: FieldParent[];
}
