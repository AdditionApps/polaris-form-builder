import * as React from "react";
import { useContext } from "react";
import Store from "../stores/RootStore";
import { Checkbox } from "@shopify/polaris";
import { observer } from "mobx-react-lite";
import { FormFieldProps } from "../interfaces/FormFieldProps";

export default observer(function({ field, ancestors }: FormFieldProps) {
  const store = useContext(Store);

  const fieldProps = {
    checked: store.getValue(field, ancestors),
    error: store.getErrors(field, ancestors),
    label: field.config["label"],
    onChange: value => store.updateValue(value, field, ancestors),
    ...field.config
  };

  return <Checkbox {...fieldProps} />;
});
