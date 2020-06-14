import { FunctionComponent } from 'react';
import { ErrorValue, Field, Units } from '.';

export interface Store {
    model: any;
    fields: Field[];
    units: Units;
    errors: Record<string, ErrorValue>;
    focus: string | null;
    customFields: FunctionComponent[];
    onModelUpdate: (model: any) => void;
    onErrorUpdate: (errors: Record<string, ErrorValue>) => void;
    onFocusUpdate: (focus: string | null) => void;
}
