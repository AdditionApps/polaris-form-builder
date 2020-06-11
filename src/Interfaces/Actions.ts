import { Field, FieldParent, ModelValue } from '.';

export interface Actions {
    updateField: (
        value: ModelValue,
        field: Field,
        ancestors?: FieldParent[],
    ) => void;
    addRepeaterRow: (
        rowIndex: number,
        model: Record<string, ModelValue>,
        field: Field,
        ancestors?: FieldParent[],
    ) => void;
    removeRepeaterRow: (
        rowIndex: number,
        model: Record<string, ModelValue>,
        field: Field,
        ancestors?: FieldParent[],
    ) => void;
}
