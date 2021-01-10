export type GroupLayout = 'stacked' | 'grouped' | 'condensed';

export interface Field {
    key: string;
    input: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config?: any;
    subFields?: Field[];
    emptyMessage?: string;
    layout?: GroupLayout;
    addButtonText?: string;
    title?: string;
    defaultValue?: string | number;
    warning?: string;
    minRows?: number;
    maxRows?: number;
}
