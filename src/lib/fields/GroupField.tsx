import * as React from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { FormFieldProps } from "../interfaces/FormFieldProps";
import { FormField } from "../interfaces/FormField";
import { FormLayout } from "@shopify/polaris";
import Store from "../stores/RootStore";
const shortid = require("shortid");

const Field = ({ field, ancestors }: FormFieldProps) => {
  const wrapperStyle = {
    marginTop: "-1.6rem",
    marginLeft: "-2rem"
  };

  const store = useContext(Store);

  return (
    <div style={wrapperStyle}>
      <FormLayout.Group condensed={field["condensed"]}>
        {field.subFields.map((subField: FormField) => {
          const Field = store.getFieldName(subField);
          const id = shortid.generate();
          return <Field field={subField} ancestors={ancestors} key={id} />;
        })}
      </FormLayout.Group>
    </div>
  );
};

export default observer(Field);
