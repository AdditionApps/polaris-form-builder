import * as React from "react";
import { useContext } from "react";
import Store from "../stores/RootStore";
import { ChoiceList } from "@shopify/polaris";
import { IField } from "../interfaces/IField";
import { IParent } from "../interfaces/IParent";
import { observer } from "mobx-react-lite";

interface IProps {
  field: IField;
  parent?: IParent;
}

export default observer(function({ field, parent }: IProps) {
  const store = useContext(Store);

  let value = store.getValue(field, parent);

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

    store.updateValue(value, field, parent);
  };

  const fieldProps = {
    selected: value,
    error: store.getErrors(field, parent),
    title: field.config["title"],
    choices: field.config["choices"],
    onChange: newValue => updateValue(newValue),
    ...field.config
  };

  return <ChoiceList {...fieldProps} />;
});
