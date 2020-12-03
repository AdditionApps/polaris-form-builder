import React from 'react';
import { FormLayout, Button, Stack } from '@shopify/polaris';
import { CirclePlusMinor } from '@shopify/polaris-icons';
import _cloneDeep from 'lodash.clonedeep';
import { Field, FieldProps } from '../Interfaces';
import { getFieldName, getValue } from '../Utils';

interface Props extends FieldProps {
    index: number;
}

export const RepeaterRow = ({
    state,
    actions,
    field,
    ancestors,
    index,
}: Props) => {
    const wrapperStyle = {
        marginTop: '-1.6rem',
        marginLeft: '-2rem',
    };

    const updatedAncestors = ancestors ? _cloneDeep(ancestors) : [];

    updatedAncestors.push({ field, index });

    const fields = field.subFields
        ? field.subFields.map((subField: Field, index: number) => {
              const Field = getFieldName(subField, state.inputs);
              return (
                  <Field
                      field={subField}
                      state={state}
                      actions={actions}
                      ancestors={updatedAncestors}
                      key={index}
                  />
              );
          })
        : null;

    const rows = getValue(state.model, field, ancestors) as Record<
        string,
        unknown
    >[];

    const canAddRows =
        !field.maxRows || (field.maxRows && rows.length < field.maxRows);
    const canRemoveRows =
        !field.minRows || (field.minRows && rows.length > field.minRows);

    const getFieldLayout = () => {
        switch (field.layout) {
            case 'stacked':
                return <FormLayout>{fields}</FormLayout>;
            case 'grouped':
                return (
                    <div style={wrapperStyle}>
                        <FormLayout.Group>{fields}</FormLayout.Group>
                    </div>
                );
            case 'condensed':
                return (
                    <div style={wrapperStyle}>
                        <FormLayout.Group condensed>{fields}</FormLayout.Group>
                    </div>
                );
            default:
                return <FormLayout>{fields}</FormLayout>;
        }
    };

    return (
        <Stack vertical spacing="loose">
            <Stack.Item>{getFieldLayout()}</Stack.Item>
            <Stack.Item>
                <Stack>
                    <Stack.Item fill>
                        {canAddRows && (
                            <Button
                                plain
                                icon={CirclePlusMinor}
                                onClick={() =>
                                    actions.addRepeaterRow(
                                        index,
                                        state.model,
                                        field,
                                        ancestors,
                                    )
                                }
                            >
                                {field.addButtonText
                                    ? field.addButtonText
                                    : 'Add row'}
                            </Button>
                        )}
                    </Stack.Item>
                    <Stack.Item>
                        {canRemoveRows && (
                            <Button
                                plain
                                destructive
                                onClick={() =>
                                    actions.removeRepeaterRow(
                                        index,
                                        state.model,
                                        field,
                                        ancestors,
                                    )
                                }
                            >
                                Remove
                            </Button>
                        )}
                    </Stack.Item>
                </Stack>
            </Stack.Item>
        </Stack>
    );
};
