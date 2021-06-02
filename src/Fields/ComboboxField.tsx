import React, { useCallback, useEffect, useState } from 'react';
import {
    TextField as PolarisTextField,
    TextFieldProps as PolarisTextFieldProps,
    OptionList,
    Popover,
} from '@shopify/polaris';
import { Field, FieldProps } from '../Interfaces';
import { getErrors, getPathFromAncestors, getValue } from '../Utils';
import Fuse from 'fuse.js';

export type ListOption = { label: string; value: string };

interface LocalField extends Field {
    config: PolarisTextFieldProps;
    options: ListOption[];
}

export interface ComboboxFieldProps extends FieldProps {
    field: LocalField;
}

const fuseOptions = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 30,
    maxPatternLength: 32,
    keys: ['label'],
};

export const ComboboxField = ({
    field,
    state,
    actions,
    ancestors,
}: ComboboxFieldProps) => {
    const [options, setOptions] = useState(field.options);
    const [popoverActive, setPopoverActive] = useState(false);
    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

    useEffect(() => {
        const inputValue = getValue(state.model, field, ancestors);
        // if value empty options = all options
        if (!inputValue) {
            setOptions(field.options);
            return;
        }

        const valueInOptions = field.options.find(
            (option) => option.value === inputValue,
        );

        // if input value is a value in options, show just that option
        if (valueInOptions) {
            setOptions([valueInOptions]);
            return;
        }

        // if input value is not value in option do a fuse search,
        // use results as options and prepend an "add X" option
        const fuse = new Fuse(field.options, fuseOptions);
        const results = fuse.search(inputValue).map((result) => result.item);

        results.splice(0, 0, {
            label: `Add "${inputValue}"`,
            value: inputValue,
        });

        setOptions(results);
    }, [getValue(state.model, field, ancestors)]);

    const fieldProps = {
        ...field.config,
        value: getValue(state.model, field, ancestors) as string | undefined,
        error: getErrors(state.errors, field, ancestors),
        label: field.config.label,
        focused: state.focus === getPathFromAncestors(field, ancestors),
        onFocus: () => {
            setPopoverActive(true);
            actions.setFocus(field, ancestors);
        },
        onChange: (value: string) => {
            actions.updateField(value, field, ancestors);
        },
    };

    const activator = <PolarisTextField {...fieldProps} />;

    return (
        <Popover
            active={popoverActive}
            activator={activator}
            onClose={togglePopoverActive}
            ariaHaspopup="listbox"
            autofocusTarget="first-node"
            fullWidth
        >
            <OptionList
                onChange={(selected: string[]) => {
                    actions.updateField(selected[0], field, ancestors);
                    setPopoverActive(false);
                }}
                selected={[getValue(state.model, field, ancestors)]}
                options={options}
            />
        </Popover>
    );
};
