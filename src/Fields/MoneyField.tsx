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
        style: 'currency',
        currency: units.currency,
    });
};

const getFormatData = (units: Units) => {
    return getFormatter(units).resolvedOptions();
};

const getMultiplier = (units: Units) => {
    const formatData = getFormatData(units);
    return 10 ** formatData.minimumFractionDigits;
};

const getFloatValue = (value: string) => {
    return parseFloat(cleanString(value));
};

export const MoneyField = ({
    field,
    state,
    actions,
    ancestors,
}: TextFieldProps) => {
    const [focus, setFocus] = useState(false);
    const multiplier = getMultiplier(state.units);
    const formatData = getFormatData(state.units);
    const value = getValue(state.model, field, ancestors) as number;
    const focusValue = value === null ? null : String(value / multiplier);
    const valueRef = useRef<string | null>(focusValue);

    if (parseFloat(valueRef.current) !== parseFloat(focusValue)) {
        valueRef.current = focusValue;
    }

    const blurValue = value
        ? getFormatter(state.units).format(
              getFloatValue(
                  getFloatValue(
                      valueRef.current ? valueRef.current : '',
                  ).toFixed(formatData.minimumFractionDigits),
              ),
          )
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
        valueRef.current = value ? cleanString(value) : null;

        const floatValue = getFloatValue(value);

        if (floatValue === null || isNaN(floatValue)) {
            actions.updateField(null, field, ancestors);
            return;
        }

        const lowestDenominatorValue = multiplier * floatValue;
        const updatedValue = parseInt(
            lowestDenominatorValue.toFixed(formatData.minimumFractionDigits),
            10,
        );

        actions.updateField(updatedValue, field, ancestors);
    };

    const fieldProps = {
        ...field.config,
        value: formattedValue,
        error: getErrors(state.errors, field, ancestors),
        label: field.config.label,
        focused: state.focus === getPathFromAncestors(field, ancestors),
        onChange: (value: string) => updateField(value),
        onFocus: () => onFieldFocus(),
        onBlur: () => onFieldBlur(),
    };

    return <TextField {...fieldProps} />;
};
