import * as React from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { FormLayout, Button, Stack } from "@shopify/polaris";
import { CirclePlusMajorMonotone } from "@shopify/polaris-icons";
import { IField } from "../../interfaces/IField";
import { IParent } from "../../interfaces/IParent";
import Store from "../../stores/RootStore";

interface IProps {
  parent: IParent;
}

const Row = ({ parent }: IProps) => {
  const store = useContext(Store);

  const wrapperStyle = {
    marginTop: "-1.6rem",
    marginLeft: "-2rem"
  };

  const controlStyle = {
    marginTop: "1rem",
    marginBottom: "2rem"
  };

  const fields = parent.field.subFields.map(
    (subField: IField, index: number) => {
      const Field = store.getFieldName(subField);
      return <Field field={subField} parent={parent} key={index} />;
    }
  );

  const getFieldLayout = () => {
    switch (parent.field.layout) {
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
              onClick={() => store.addRepeaterRow(parent.field, parent.index)}
            >
              Add row
            </Button>
          </Stack.Item>
          <Stack.Item>
            <Button
              plain
              destructive
              onClick={() =>
                store.removeRepeaterRow(parent.field, parent.index)
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

export default observer(Row);
