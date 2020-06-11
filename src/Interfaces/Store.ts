import { FunctionComponent } from 'react';
import { ErrorValue, Field, Units } from '.';

export interface Store {
    model: any;
    fields: Field[];
    units: Units;
    errors: Record<string, ErrorValue>;
    customFields: FunctionComponent[];
    onModelUpdate: (model: Record<string, unknown>) => void;
    onErrorUpdate: (errors: Record<string, unknown>) => void;
}
