export interface IField {
  key: string;
  input: string;
  config?: object;
  defaultValue?: any;
  subFields?: IField[];
  title?: string;
  emptyMessage?: string;
  layout?: "stacked" | "grouped" | "condensed";
  addButtonText?: string;
  infoMessage?: string;
  infoMessageCondition?: boolean;
}
