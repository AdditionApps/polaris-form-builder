export interface FormField {
  key: string;
  input: string;
  config?: object;
  defaultValue?: any;
  subFields?: FormField[];
  title?: string;
  emptyMessage?: string;
  layout?: "stacked" | "grouped" | "condensed";
  addButtonText?: string;
  infoMessage?: string;
  infoMessageCondition?: boolean;
}
