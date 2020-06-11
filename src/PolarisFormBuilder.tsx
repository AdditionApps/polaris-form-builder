import React, { memo } from 'react';
import flyd from 'flyd';
import meiosis from 'meiosis-setup/mergerino';
import merge from 'mergerino';
import _isEqual from 'lodash.isequal';
import { FieldContainer } from './Components/FieldContainer';
import { setup } from './Store/FormStore';
import { FormBuilder } from './Interfaces';

export const FormBuilderView = (props: FormBuilder) => {
    const defaults = {
        units: {},
        errors: {},
        customFields: [],
        onErrorUpdate: () => {
            return;
        },
    };
    const form = setup({ ...defaults, ...props });
    const { states, actions } = meiosis({ stream: flyd, merge, app: form });

    return (
        <FieldContainer states={states} actions={actions} key={Date.now()} />
    );
};

const propsEqual = (prev: FormBuilder, next: FormBuilder) => {
    return (
        _isEqual(prev.fields, next.fields) &&
        _isEqual(prev.errors, next.errors) &&
        _isEqual(prev.units, next.units)
    );
};

export const PolarisFormBuilder = memo(FormBuilderView, propsEqual);
