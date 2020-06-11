import {
    ErrorValue,
    Field,
    MappedFields,
    ModelValue,
    Units,
} from '../Interfaces';

export interface State {
    model: Record<string, ModelValue>;
    errors: Record<string, ErrorValue>;
    fields: Field[];
    inputs: MappedFields;
    units: Units;
}
