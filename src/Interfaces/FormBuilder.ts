import { ErrorValue, Field, Units } from '.';
import { FunctionComponent } from 'react';

export interface FormBuilder {
    model: any;
    fields: Field[];
    units?: Units;
    errors?: Record<string, ErrorValue>;
    customFields?: FunctionComponent[];
    onModelUpdate: (model: Record<string, unknown>) => void;
    onErrorUpdate?: (errors: Record<string, unknown>) => void;
}
