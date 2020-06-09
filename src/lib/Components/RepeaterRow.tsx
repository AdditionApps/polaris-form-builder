import React from "react";
import { FormLayout, Button, Stack } from "@shopify/polaris";
import { CirclePlusMajorMonotone } from "@shopify/polaris-icons";
import _cloneDeep from "lodash.clonedeep";
import { Field, FieldProps } from "../Interfaces";
import { getFieldName } from "../Utils";

interface Props extends FieldProps {
  index: number;
}

export const RepeaterRow = ({
  state,
  actions,
  field,
  ancestors,
  index
}: Props) => {
  const wrapperStyle = {
    marginTop: "-1.6rem",
    marginLeft: "-2rem"
  };

  const controlStyle = {
    marginTop: "1rem",
    marginBottom: "2rem"
  };

  const updatedAncestors = ancestors ? _cloneDeep(ancestors) : [];

  updatedAncestors.push({ field, index });

  const fields = field.subFields.map((subField: Field, index: number) => {
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
  });

  const getFieldLayout = () => {
    switch (field.layout) {
      case "stacked":
        return <FormLayout>{fields}</FormLayout>;
      case "grouped":
        return (
          <div style={wrapperStyle}>
            <FormLayout.Group>{fields}</FormLayout.Group>
          </div>
        );
      case "condensed":
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
    <div>
      {getFieldLayout()}
      <div style={controlStyle}>
        <Stack>
          <Stack.Item fill>
            <Button
              plain
              icon={CirclePlusMajorMonotone}
              onClick={() =>
                actions.addRepeaterRow(index, state.model, field, ancestors)
              }
            >
              {field.addButtonText ? field.addButtonText : "Add row"}
            </Button>
          </Stack.Item>
          <Stack.Item>
            <Button
              plain
              destructive
              onClick={() =>
                actions.removeRepeaterRow(index, state.model, field, ancestors)
              }
            >
              Remove
            </Button>
          </Stack.Item>
        </Stack>
      </div>
    </div>
  );
};
