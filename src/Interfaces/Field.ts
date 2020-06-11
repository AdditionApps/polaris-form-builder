import {
    TextFieldProps,
    CheckboxProps,
    SelectProps,
    ChoiceListProps,
    RangeSliderProps,
} from '@shopify/polaris';

type PolarisFieldProps =
    | TextFieldProps
    | CheckboxProps
    | SelectProps
    | ChoiceListProps
    | RangeSliderProps;

type Layout = 'stacked' | 'grouped' | 'condensed';

export interface Field {
    key: string;
    input: string;
    config?: PolarisFieldProps;
    subFields?: Field[];
    emptyMessage?: string;
    layout?: Layout;
    addButtonText?: string;
    title?: string;
    defaultValue?: string | number;
}
