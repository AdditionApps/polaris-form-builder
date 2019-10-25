import * as React from "react";
import { useState, useEffect, useContext } from "react";
import Store from "../stores/RootStore";
import { TextField } from "@shopify/polaris";
import { IFieldProps } from "../interfaces/IFieldProps";
import { observer } from "mobx-react-lite";

const getLocale = units => {
  return units && units.hasOwnProperty("locale")
    ? units.locale
    : navigator.language;
};

const getFormatter = units => {
  return new Intl.NumberFormat(getLocale(units), {
    style: "percent",
    maximumSignificantDigits: 3
  });
};

const cleanString = value => {
  return String(value).replace(/[^0-9.]/g, "");
};

const toDecimal = value => {
  if (value == null || value === "") return null;

  return parseFloat(cleanString(value)) / 100;
};

const fromDecimal = value => {
  if (value == null || value === "") return null;

  return value * 100;
};

const Field = ({ field, ancestors }: IFieldProps) => {
  const store = useContext(Store);
  const value = store.getValue(field, ancestors);

  const [focus, setFocus] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(
    String(fromDecimal(value))
  );
  useEffect(() => {
    if (internalValue == null) return;

    const convertedValue = toDecimal(internalValue);

    store.updateValue(convertedValue, field, ancestors);
  });

  const blurValue = value
    ? getFormatter(store.units).format(toDecimal(internalValue))
    : null;
  const formattedValue = focus ? internalValue : blurValue;

  const onFieldFocus = () => {
    setFocus(true);
  };

  const onFieldBlur = () => {
    setFocus(false);
  };

  const updateField = newValue => {
    setInternalValue(cleanString(String(newValue)));
  };

  const fieldProps = {
    value: formattedValue,
    error: store.getErrors(field, ancestors),
    label: field.config["label"],
    onChange: newValue => updateField(newValue),
    onFocus: () => onFieldFocus(),
    onBlur: () => onFieldBlur(),
    ...field.config
  };

  return <TextField {...fieldProps} />;
};

export default observer(Field);
