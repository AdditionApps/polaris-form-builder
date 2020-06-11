import { Actions, Field, FieldParent, State } from '.';

export interface FieldProps {
    field: Field;
    state: State;
    actions: Actions;
    ancestors?: FieldParent[];
}
