import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";
import { TextField } from "@shopify/polaris";
import { FormFieldProps } from "../interfaces/FormFieldProps";
import Store from "../stores/RootStore";

const cleanString = value => {
  return String(value).replace(/[^0-9.]/g, "");
};

const convertFromGrams = (value, weightUnit) => {
  if (value == null || value === "") return null;

  switch (weightUnit) {
    case "kg":
      return value / 1000;
    case "lb":
      let lb = value * 0.00220462;
      return lb.toFixed(2);
    case "oz":
      let oz = value * 0.035274;
      return oz.toFixed(2);
    default:
      return value;
  }
};

const convertToGrams = (value, weightUnit) => {
  if (value == null || value === "") return null;

  switch (weightUnit) {
    case "kg":
      return parseInt(String(value * 1000), 10);
    case "lb":
      return parseInt(String(value * 453.592), 10);
    case "oz":
      return parseInt(String(value * 28.35), 10);
    default:
      return parseInt(String(value), 10);
  }
};

const Field = ({ field, ancestors }: FormFieldProps) => {
  const store = useContext(Store);
  const value = store.getValue(field, ancestors);

  const weightUnit = store.units.hasOwnProperty("weight")
    ? store.units.weight
    : "kg";

  const [internalValue, setInternalValue] = useState(
    convertFromGrams(value, weightUnit)
  );

  useEffect(() => {
    if (internalValue == null) return;

    const convertedValue = convertToGrams(
      parseFloat(internalValue),
      weightUnit
    );

    store.updateValue(convertedValue, field, ancestors);
  });

  const updateField = newValue => {
    setInternalValue(cleanString(newValue));
  };

  const fieldProps = {
    value: internalValue,
    suffix: weightUnit,
    error: store.getErrors(field, ancestors),
    label: field.config["label"],
    onChange: newValue => updateField(newValue),
    ...field.config
  };

  return <TextField {...fieldProps} />;
};

export default observer(Field);
