export interface IField {
  key: string;
  input: string;
  config: any;
  defaultValue?: any;
  subFields?: IField[];
  infoMessage?: string;
  infoMessageCondition?: boolean;
}
