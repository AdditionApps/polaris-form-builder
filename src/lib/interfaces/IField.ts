export interface IField {
  key: string;
  input: string;
  config?: object;
  defaultValue?: any;
  subFields?: IField[];
  title?: string;
  emptyMessage?: string;
  layout?: "stacked" | "grouped" | "condensed";
  infoMessage?: string;
  infoMessageCondition?: boolean;
}
