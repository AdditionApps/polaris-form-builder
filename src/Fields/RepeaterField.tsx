import React from 'react';
import { Subheading, TextContainer, Button, Stack } from '@shopify/polaris';
import { CirclePlusMajorMonotone } from '@shopify/polaris-icons';
import { FieldProps } from '../Interfaces';
import { getValue } from '../Utils';
import { RepeaterRows } from '../Components/RepeaterRows';

export const RepeaterField = ({
    field,
    state,
    actions,
    ancestors,
}: FieldProps) => {
    const rows = getValue(state.model, field, ancestors) as Record<
        string,
        unknown
    >[];

    const showEmptyState = rows == null || rows.length === 0;

    const emptyStateLayout = (
        <Stack vertical spacing="loose">
            {field.emptyMessage && (
                <Stack.Item>
                    <p>{field.emptyMessage}</p>
                </Stack.Item>
            )}
            <Stack.Item fill>
                <Button
                    plain
                    icon={CirclePlusMajorMonotone}
                    onClick={() =>
                        actions.addRepeaterRow(0, state.model, field, ancestors)
                    }
                >
                    {field.addButtonText ? field.addButtonText : 'Add row'}
                </Button>
            </Stack.Item>
        </Stack>
    );

    const rowLayout = (
        <RepeaterRows
            state={state}
            actions={actions}
            field={field}
            ancestors={ancestors}
        />
    );

    return (
        <Stack vertical spacing="loose">
            {field.title && (
                <Stack.Item>
                    <TextContainer spacing="loose">
                        <Subheading element="p">{field.title}</Subheading>
                    </TextContainer>
                </Stack.Item>
            )}
            {showEmptyState ? emptyStateLayout : rowLayout}
        </Stack>
    );
};
