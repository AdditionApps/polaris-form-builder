import {
  TextFieldProps,
  CheckboxProps,
  SelectProps,
  ChoiceListProps,
  RangeSliderProps
} from "@shopify/polaris";

type PolarisFieldProps =
  | TextFieldProps
  | CheckboxProps
  | SelectProps
  | ChoiceListProps
  | RangeSliderProps;

export interface Field {
  key: string;
  input: string;
  config?: PolarisFieldProps;
  subFields?: Field[];
  emptyMessage?: string;
  layout?: "stacked" | "grouped" | "condensed";
  addButtonText?: string;
  title?: string;
  defaultValue?: string | number
}
