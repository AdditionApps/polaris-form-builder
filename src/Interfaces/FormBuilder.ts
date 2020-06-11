import { ErrorValue, Field, ModelValue, Units } from '.';
import { FunctionComponent } from 'react';

export interface FormBuilder {
    model: Record<string, ModelValue>;
    fields: Field[];
    units?: Units;
    errors?: Record<string, ErrorValue>;
    customFields?: FunctionComponent[];
    onModelUpdate: (model: Record<string, ModelValue>) => void;
    onErrorUpdate?: (errors: Record<string, ErrorValue>) => void;
}
