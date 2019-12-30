import * as React from "react";
import { useContext } from "react";
import Store from "../stores/RootStore";
import { ChoiceList } from "@shopify/polaris";
import { observer } from "mobx-react-lite";
import { FormFieldProps } from "../interfaces/FormFieldProps";

export default observer(function({ field, ancestors }: FormFieldProps) {
  const store = useContext(Store);

  let value = store.getValue(field, ancestors);

  if (!Array.isArray(value)) {
    value = field.config["allowMultiple"] && value == null ? [] : [value];
  }

  const updateValue = newValue => {
    let value;
    if (newValue.length === 0) {
      value = null;
    } else {
      value = field.config["allowMultiple"] ? newValue : newValue[0];
    }

    store.updateValue(value, field, ancestors);
  };

  const fieldProps = {
    selected: value,
    error: store.getErrors(field, ancestors),
    title: field.config["title"],
    choices: field.config["choices"],
    onChange: newValue => updateValue(newValue),
    ...field.config
  };

  return <ChoiceList {...fieldProps} />;
});
