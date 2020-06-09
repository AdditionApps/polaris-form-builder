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
  defaultValue?: any;
  subFields?: Field[];
  title?: string;
  emptyMessage?: string;
  layout?: "stacked" | "grouped" | "condensed";
  addButtonText?: string;
  infoMessage?: string;
  infoMessageCondition?: boolean;
}
