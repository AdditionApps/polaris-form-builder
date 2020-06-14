import { ErrorValue, Field, Units } from '.';
import { FunctionComponent } from 'react';

export interface FormBuilder {
    model: any;
    fields: Field[];
    units?: Units;
    errors?: Record<string, ErrorValue>;
    focus?: string | null;
    customFields?: FunctionComponent[];
    onModelUpdate: (model: any) => void;
    onErrorUpdate?: (errors: Record<string, ErrorValue>) => void;
    onFocusUpdate?: (focus: string | null) => void;
}
