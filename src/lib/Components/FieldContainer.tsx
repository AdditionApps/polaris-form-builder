import React, { useState } from "react";
import { FormLayout } from "@shopify/polaris";
import { Actions, Field } from "../Interfaces";
import { getFieldName } from "../Utils";

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
          <Field field={field} state={state} actions={actions} key={index} />
        );
      })}
    </FormLayout>
  );
};
