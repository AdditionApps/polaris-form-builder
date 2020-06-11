import React, { FunctionComponent } from 'react';
import {
    Checkbox,
    CheckboxProps as PolarisCheckboxProps,
} from '@shopify/polaris';
import { Field, FieldProps } from '../Interfaces';
import { getErrors, getValue } from '../Utils';

interface LocalField extends Field {
    config: PolarisCheckboxProps;
}

export interface CheckboxProps extends FieldProps {
    field: LocalField;
}

export const CheckboxField: FunctionComponent<CheckboxProps> = ({
    field,
    state,
    actions,
    ancestors,
}: CheckboxProps) => {
    const fieldProps = {
        ...field.config,
        checked: getValue(state.model, field, ancestors) as
            | boolean
            | 'indeterminate',
        label: field.config.label,
        error: getErrors(state.errors, field, ancestors),
        onChange: (value: boolean) =>
            actions.updateField(value, field, ancestors),
    };

    return <Checkbox {...fieldProps} />;
};
