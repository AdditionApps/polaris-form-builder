import React from "react";
import { FormLayout } from "@shopify/polaris";
import { Field, FieldProps } from "../Interfaces";
import { getFieldName } from "../Utils";

export const GroupField = ({
  field,
  state,
  actions,
  ancestors
}: FieldProps) => {
  const wrapperStyle = {
    marginTop: "-1.6rem",
    marginLeft: "-2rem"
  };

  const subfieldMarkup = field.subFields.map(
    (subField: Field, index: number) => {
      const Field = getFieldName(subField, state.inputs);
      return (
        <Field
          field={subField}
          state={state}
          actions={actions}
          ancestors={ancestors}
          key={index}
        />
      );
    }
  );

  return (
    <div style={wrapperStyle}>
      <FormLayout.Group condensed={field.layout === 'condensed'}>
        {subfieldMarkup}
      </FormLayout.Group>
    </div>
  );
};
