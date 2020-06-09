import { Field, Units } from ".";

export interface FormBuilder {
  model: object;
  fields: Field[];
  units?: Units;
  errors?: object;
  customFields?: Field[];
  onModelUpdate: (model: object) => void;
  onErrorUpdate?: (errors: object) => void;
}
