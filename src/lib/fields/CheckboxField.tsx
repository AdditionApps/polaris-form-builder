import * as React from "react";
import { useContext } from "react";
import Store from "../stores/RootStore";
import { Checkbox } from "@shopify/polaris";
import { IField } from "../interfaces/IField";
import { IParent } from "../interfaces/IParent";
import { observer } from "mobx-react-lite";

interface IProps {
  field: IField;
  parent?: IParent;
}

export default observer(function({ field, parent }: IProps) {
  const store = useContext(Store);

  const fieldProps = {
    checked: store.getValue(field, parent),
    error: store.getErrors(field, parent),
    label: field.config["label"],
    onChange: value => store.updateValue(value, field, parent),
    ...field.config
  };

  return <Checkbox {...fieldProps} />;
});
