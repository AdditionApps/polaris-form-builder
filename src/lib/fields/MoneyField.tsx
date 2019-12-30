import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";
import { TextField } from "@shopify/polaris";
import { FormFieldProps } from "../interfaces/FormFieldProps";
import Store from "../stores/RootStore";
const LocaleCurrency = require("locale-currency");

const getLocale = units => {
  return units && units.hasOwnProperty("locale")
    ? units.locale
    : navigator.language;
};

const getCurrency = units => {
  return units && units.hasOwnProperty("currency")
    ? units.currency
    : LocaleCurrency.getCurrency(getLocale(units));
};

const getFormatter = units => {
  return new Intl.NumberFormat(getLocale(units), {
    style: "currency",
    currency: getCurrency(units)
  });
};

const getFormatData = units => {
  return getFormatter(units).resolvedOptions();
};

const getMultiplier = units => {
  const formatData = getFormatData(units);
  return 10 ** formatData.minimumFractionDigits;
};

const getFloatValue = (value: string) => {
  let val = value.replace(/[^0-9.]/g, "");
  return parseFloat(val);
};

const cleanString = (value: string) => {
  return value.replace(/[^0-9.]/g, "");
};

const Field = ({ field, ancestors }: FormFieldProps) => {
  const store = useContext(Store);

  const multiplier = getMultiplier(store.units);
  const value = store.getValue(field, ancestors);
  const focusValue = value ? String(value / multiplier) : null;

  const [focus, setFocus] = useState(false);
  const [internalValue, setInternalValue] = useState<string | null>(focusValue);

  useEffect(() => {
    if (internalValue == null) return;

    const formatData = getFormatData(store.units);
    const floatValue = parseFloat(cleanString(internalValue)).toFixed(
      formatData.minimumFractionDigits
    );
    const updatedValue = multiplier * parseFloat(floatValue);
    const convertedValue = parseInt(String(updatedValue), 10);
    store.updateValue(convertedValue, field, ancestors);
  });

  const blurValue = value
    ? getFormatter(store.units).format(getFloatValue(internalValue))
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
