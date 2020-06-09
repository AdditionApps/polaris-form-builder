import { Field, Units } from ".";

export interface FormBuilder {
  model: object;
  units: Units;
  fields: Field[];
  errors?: object;
  customFields?: Field[];
  onModelUpdate: (model: object) => void;
  onErrorUpdate?: (errors: object) => void;
}
