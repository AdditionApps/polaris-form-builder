import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { Autocomplete, AutocompleteProps as PolarisAutocompleteProps, } from '@shopify/polaris';
import { Field, FieldProps } from '../Interfaces';
import { getErrors, getValue } from '../Utils';
import Fuse from 'fuse.js';

interface LocalPolarisAutocompleteProps extends PolarisAutocompleteProps {
    label: string;
}

interface LocalField extends Field {
    config: LocalPolarisAutocompleteProps;
}

export interface AutocompleteProps extends Omit<FieldProps, 'field'> {
    field: LocalField;
}

const fuseOptions = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: ['label'],
};

export const AutocompleteField: FunctionComponent<AutocompleteProps> = ({
    field,
    state,
    actions,
    ancestors,
}: AutocompleteProps) => {
    // Get the selected option (if there is one) from the model value
    const selectedOption = field.config.options.find((option) => {
        return option.value === getValue(state.model, field, ancestors);
    });

    const [inputValue, setInputValue] = useState<string>(
        selectedOption ? (selectedOption.label as string) : '',
    );

    const [selectedOptions, setSelectedOptions] = useState(
        selectedOption ? [selectedOption.value] : [],
    );

    const [options, setOptions] = useState(field.config.options);

    const firstRender = useRef(true);

    useEffect(() => {
        setInputValue((selectedOption?.label as string) || '');
    }, [selectedOption?.value]);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        // If an option has been selected from the dropdown the input value
        // will match the label for a option in the dropdown.  If so we
        // will show the full options list to allow another selection
        if (
            field.config.options.find((option) => option.label === inputValue)
        ) {
            setOptions(field.config.options);
            return;
        }

        if (inputValue === '') {
            actions.updateField('', field, ancestors);
        }

        const fuse = new Fuse(field.config.options, fuseOptions);
        const results = inputValue
            ? fuse.search(inputValue).map((result) => result.item)
            : field.config.options;

        setOptions(results);
    }, [inputValue]);

    const textField = (
        <Autocomplete.TextField
            onChange={(value) => {
                setInputValue(value);
            }}
            label={field.config.label}
            value={inputValue}
            error={getErrors(state.errors, field, ancestors)}
        />
    );

    const fieldProps = {
        options: options,
        selected: selectedOptions,
        onSelect: (selected: string[]) => {
            setSelectedOptions(selected);
            actions.updateField(selected[0], field, ancestors);
        },
        textField,
    };

    return <Autocomplete {...fieldProps} />;
};
