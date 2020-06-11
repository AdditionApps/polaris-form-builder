import {
    ErrorValue,
    Field,
    MappedFields,
    Units,
} from '../Interfaces';

export interface State {
    model: any;
    errors: Record<string, ErrorValue>;
    fields: Field[];
    inputs: MappedFields;
    units: Units;
}
