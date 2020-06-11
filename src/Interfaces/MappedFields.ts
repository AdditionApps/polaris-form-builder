import { FunctionComponent } from 'react';
import { FieldProps } from './FieldProps';

export interface MappedFields {
    [name: string]: FunctionComponent<FieldProps>;
}
