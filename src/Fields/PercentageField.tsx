import React, { useRef, useState } from 'react';
import { TextField } from '@shopify/polaris';
import { Units } from '../Interfaces';
import {
    cleanString,
    getErrors,
    getPathFromAncestors,
    getValue,
} from '../Utils';
import { TextFieldProps } from './TextField';

const getFormatter = (units: Units) => {
    return new Intl.NumberFormat(units.locale, {
        style: 'percent',
        maximumSignificantDigits: 3,
    });
};

const sanitiseInput = (value: string) => {
    return cleanString(value).split('.').slice(0, 2).join('.');
};

const toDecimal = (value: any) => {
    if (value == null || value === '') return null;

    const decimalValue = parseFloat(sanitiseInput(value)) / 100;

    return parseFloat(decimalValue.toFixed(4));
};

const fromDecimal = (value: any) => {
    if (value == null || value === '') return null;

    return (value * 100).toString();
};

export const PercentageField = ({
    field,
    state,
    actions,
    ancestors,
}: TextFieldProps) => {
    const [focus, setFocus] = useState(false);
    const value = getValue(state.model, field, ancestors) as number;
    const valueFromDecimal = fromDecimal(value);
    const valueRef = useRef(valueFromDecimal);

    if (parseFloat(valueRef.current) !== parseFloat(valueFromDecimal)) {
        valueRef.current = valueFromDecimal;
    }

    const blurValue = valueRef.current
        ? getFormatter(state.units).format(value)
        : null;
    const formattedValue = focus ? valueRef.current : blurValue;

    const onFieldFocus = () => {
        actions.setFocus(field, ancestors);
        setFocus(true);
    };

    const onFieldBlur = () => {
        setFocus(false);
    };

    const updateField = (value: string) => {
        valueRef.current = value;
        actions.updateField(toDecimal(value), field, ancestors);
    };

    const fieldProps = {
        ...field.config,
        value: formattedValue || undefined,
        error: getErrors(state.errors, field, ancestors),
        label: field.config.label,
        focused: state.focus === getPathFromAncestors(field, ancestors),
        onChange: (value: string) => updateField(value),
        onFocus: () => onFieldFocus(),
        onBlur: () => onFieldBlur(),
    };

    return <TextField {...fieldProps} />;
};
