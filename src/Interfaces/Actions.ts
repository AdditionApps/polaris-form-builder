import { Field, FieldParent } from '.';

export interface Actions {
    updateField: (
        value: any,
        field: Field,
        ancestors?: FieldParent[],
    ) => void;
    addRepeaterRow: (
        rowIndex: number,
        model: Record<string, unknown>,
        field: Field,
        ancestors?: FieldParent[],
    ) => void;
    removeRepeaterRow: (
        rowIndex: number,
        model: Record<string, unknown>,
        field: Field,
        ancestors?: FieldParent[],
    ) => void;
}
