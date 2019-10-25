import * as React from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Subheading, TextContainer, Button, Stack } from "@shopify/polaris";
import { CirclePlusMajorMonotone } from "@shopify/polaris-icons";
import { IFieldProps } from "../interfaces/IFieldProps";
import RepeaterRows from "./components/RepeaterRows";
import Store from "../stores/RootStore";

const Field = ({ field, ancestors }: IFieldProps) => {
  const store = useContext(Store);

  const rows = store.getValue(field, ancestors);

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
          onClick={() => store.addRepeaterRow(field, 0, ancestors)}
        >
          {field.addButtonText ? field.addButtonText : "Add row"}
        </Button>
      </Stack.Item>
    </Stack>
  );

  const rowLayout = <RepeaterRows field={field} ancestors={ancestors} />;

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

export default observer(Field);
