import React from 'react';
import { FieldProps } from '../Interfaces';
import { getValue } from '../Utils';
import { RepeaterRow } from './RepeaterRow';

export const RepeaterRows =({
  field,
  state,
  actions,
  ancestors
}: FieldProps) => {
  const rows = getValue(state.model, field, ancestors);

  return rows.map((row: object, index: number) => {
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
  });
};
