import * as React from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Select } from "@shopify/polaris";
import { IFieldProps } from "../interfaces/IFieldProps";
import Store from "../stores/RootStore";

const Field = ({ field, ancestors }: IFieldProps) => {
  const store = useContext(Store);

  let value = store.getValue(field, ancestors);

  if (value == null) {
    value = field.config["options"][0].value;
  }

  const fieldProps = {
    value: value,
    error: store.getErrors(field, ancestors),
    label: field.config["label"],
    onChange: value => store.updateValue(value, field, ancestors),
    ...field.config
  };

  return <Select {...fieldProps} />;
};

export default observer(Field);
