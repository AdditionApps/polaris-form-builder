import React from 'react';
import { FieldProps } from '../Interfaces';
import { getValue } from '../Utils';
import { RepeaterRow } from './RepeaterRow';
import { Stack } from '@shopify/polaris';

export const RepeaterRows = ({
    field,
    state,
    actions,
    ancestors,
}: FieldProps) => {
    const rows = getValue(state.model, field, ancestors) as Record<
        string,
        unknown
    >[];

    const rowLayout = rows
        ? rows.map((row: Record<string, unknown>, index: number) => {
              return (
                  <RepeaterRow
                      state={state}
                      actions={actions}
                      field={field}
                      ancestors={ancestors}
                      index={index}
                      key={index}
                  />
              );
          })
        : null;

    return <Stack vertical>{rowLayout}</ Stack>;
};
