import { Field, FieldParent } from '.';

export interface Actions {
    updateField: (value: any, field: Field, ancestors?: FieldParent[]) => void;
    setFocus: (field: Field, ancestors?: FieldParent[]) => void;
    addRepeaterRow: (
        rowIndex: number,
        model: any,
        field: Field,
        ancestors?: FieldParent[],
    ) => void;
    removeRepeaterRow: (
        rowIndex: number,
        model: any,
        field: Field,
        ancestors?: FieldParent[],
    ) => void;
}
