import React, { useState } from 'react';
import { FormLayout } from '@shopify/polaris';
import { Actions, Field } from '../Interfaces';
import { getFieldName } from '../Utils';

interface Props {
    states: any;
    actions: Actions;
}

export const FieldContainer = ({ states, actions }: Props) => {
    const [init, setInit] = useState(false);
    const [state, setState] = useState(states());
    // const activeElement = useRef(document.activeElement as HTMLElement);

    if (!init) {
        setInit(true);
        states.map(setState);
    }

    // console.log(activeElement.current);

    // useEffect(() => {
    //     return () => {
    //         const element = document.activeElement as HTMLElement;
    //         if (element && element.tagName === 'INPUT') {
    //             activeElement.current = element;
    //             console.log('activeElement after render:', activeElement.current);
    //         }
    //     };
    // });

    return (
        <FormLayout>
            {state.fields.map((field: Field, index: number) => {
                const Field = getFieldName(field, state.inputs);

                return (
                    <Field
                        field={field}
                        state={state}
                        actions={actions}
                        key={index}
                    />
                );
            })}
        </FormLayout>
    );
};
