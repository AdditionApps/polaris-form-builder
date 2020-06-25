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

export type GroupLayout = 'stacked' | 'grouped' | 'condensed';

export interface Field {
    key: string;
    input: string;
    config?: PolarisFieldProps;
    subFields?: Field[];
    emptyMessage?: string;
    layout?: GroupLayout;
    addButtonText?: string;
    title?: string;
    defaultValue?: string | number;
    minRows?: number;
    maxRows?: number;
}
