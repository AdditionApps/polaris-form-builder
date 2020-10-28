import React from 'react';
import {
    TextField as PolarisTextField,
    TextFieldProps as PolarisTextFieldProps,
} from '@shopify/polaris';
import { Field, FieldProps, Units } from '../Interfaces';
import { getErrors, getPathFromAncestors, getValue } from '../Utils';

interface LocalField extends Field {
    config: PolarisTextFieldProps;
}

export interface TextFieldProps extends FieldProps {
    field: LocalField;
}

const getFormatter = (units: Units) => {
    return new Intl.NumberFormat(units.locale, {
        style: 'currency',
        currency: units.currency,
    });
};

export const SimpleMoneyField = ({
    field,
    state,
    actions,
    ancestors,
}: TextFieldProps) => {
    const currencyData = getFormatter(state.units)
        .formatToParts()
        .find(part => part.type === 'currency');
    
    const currencySymbol = currencyData && currencyData.hasOwnProperty('value')
        ? currencyData.value
        : null;

    const fieldProps = {
        ...field.config,
        prefix: currencySymbol,
        value: getValue(state.model, field, ancestors) as string | undefined,
        error: getErrors(state.errors, field, ancestors),
        label: field.config.label,
        focused: state.focus === getPathFromAncestors(field, ancestors),
        onFocus: () => {
            actions.setFocus(field, ancestors);
        },
        onChange: (value: string) => {
            actions.updateField(value, field, ancestors);
        },
    };

    return <PolarisTextField {...fieldProps} />;
};
