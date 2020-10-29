import React, { useState } from 'react';
import { FormLayout, Banner, Stack } from '@shopify/polaris';
import { Actions, Field } from '../Interfaces';
import { getFieldName } from '../Utils';

interface Props {
    states: any;
    actions: Actions;
}

export const FieldContainer = ({ states, actions }: Props) => {
    const [init, setInit] = useState(false);
    const [state, setState] = useState(states());

    if (!init) {
        setInit(true);
        states.map(setState);
    }

    return (
        <FormLayout>
            {state.fields.map((field: Field, index: number) => {
                const Field = getFieldName(field, state.inputs);

                return (
                    <Stack vertical spacing="tight" key={index}>
                        <Field field={field} state={state} actions={actions} />
                        {field.warning && (
                            <Banner status="warning">
                                <p>{field.warning}</p>
                            </Banner>
                        )}
                    </Stack>
                );
            })}
        </FormLayout>
    );
};
