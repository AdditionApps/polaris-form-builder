import React, { useEffect } from 'react';
import { Subheading, TextContainer, Button, Stack } from '@shopify/polaris';
import { CirclePlusMajor } from '@shopify/polaris-icons';
import { FieldProps } from '../Interfaces';
import { getValue } from '../Utils';
import { RepeaterRows } from '../Components/RepeaterRows';

export const RepeaterField = ({
    field,
    state,
    actions,
    ancestors,
}: FieldProps) => {

    const titleStyle = {
        marginTop: '2.6rem',
    };

    const rows = getValue(state.model, field, ancestors) as Record<
        string,
        unknown
    >[];

    const subFieldsWrapperStyle = ancestors
        ? {
              borderLeft: '5px solid #f4f6f8',
              paddingLeft: '2rem',
              marginTop: '2rem',
              overflow: 'auto',
          }
        : null;

    useEffect(() => {
        const shouldAddMinRows =
            field.minRows && (!rows || rows.length < field.minRows);

        if (shouldAddMinRows) {
            for (let i = 0; i < field.minRows; i++) {
                actions.addRepeaterRow(i, state.model, field, ancestors);
            }
        }
    });

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
                    icon={CirclePlusMajor}
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
        <div style={subFieldsWrapperStyle}>
            {field.title && (
                <div style={titleStyle}>
                    <TextContainer spacing="loose">
                        <Subheading element="p">{field.title}</Subheading>
                    </TextContainer>
                </div>
            )}
            {showEmptyState ? emptyStateLayout : rowLayout}
        </div>
    );
};
