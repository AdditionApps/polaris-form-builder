import React from 'react';
import { FieldProps, ModelValue } from '../Interfaces';
import { getValue } from '../Utils';
import { RepeaterRow } from './RepeaterRow';

export const RepeaterRows = ({
    field,
    state,
    actions,
    ancestors,
}: FieldProps) => {
    const rows = getValue(state.model, field, ancestors) as Record<
        string,
        ModelValue
    >[];

    const rowLayout = rows
        ? rows.map((row: Record<string, ModelValue>, index: number) => {
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

    return <>{rowLayout}</>;
};
