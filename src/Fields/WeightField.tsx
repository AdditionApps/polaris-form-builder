import React, { useRef } from 'react';
import { TextField } from '@shopify/polaris';
import { WeightUnits } from '../Interfaces';
import { cleanString, getErrors, getValue } from '../Utils';
import { TextFieldProps } from './TextField';

const convertFromGrams = (value: number | null, weightUnit: WeightUnits) => {
    if (value !== 0 && !value) return null;

    switch (weightUnit) {
        case 'kg':
            return (value / 1000).toString();
        case 'lb':
            const lb = value * 0.00220462;
            return lb.toFixed(2).toString();
        case 'oz':
            const oz = value * 0.035274;
            return oz.toFixed(2).toString();
        default:
            return value.toString();
    }
};

const convertToGrams = (value: number | null, weightUnit: WeightUnits) => {
    if (value !== 0 && !value) return null;

    switch (weightUnit) {
        case 'kg':
            return parseInt(String(value * 1000), 10);
        case 'lb':
            return parseInt(String(value * 453.592), 10);
        case 'oz':
            return parseInt(String(value * 28.35), 10);
        default:
            return parseInt(String(value), 10);
    }
};

export const WeightField = ({
    field,
    state,
    actions,
    ancestors,
}: TextFieldProps) => {
    const value = getValue(state.model, field, ancestors) as number | null;
    const units = state.units.weight as WeightUnits;
    const valueFromGrams = convertFromGrams(value, units);
    const valueRef = useRef(valueFromGrams);

    if (valueRef.current !== valueFromGrams) {
        valueRef.current = valueFromGrams;
    }

    const updateField = (value: string) => {
        valueRef.current = cleanString(value);
        const updatedValue = value
            ? convertToGrams(parseFloat(cleanString(value)), units)
            : null;
        actions.updateField(updatedValue, field, ancestors);
    };

    const fieldProps = {
        ...field.config,
        value: valueRef.current || undefined,
        error: getErrors(state.errors, field, ancestors),
        suffix: state.units.weight,
        label: field.config.label,
        onChange: (value: string) => updateField(value),
    };

    return <TextField {...fieldProps} />;
};
