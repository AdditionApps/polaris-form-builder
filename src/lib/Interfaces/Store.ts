import { Field, Units } from ".";

export interface Store {
  model: object;
  errors: object;
  units: Units;
  fields: Field[];
  customFields: Field[];
  onModelUpdate: (model: object) => void;
  onErrorUpdate: (errors: object) => void;
}
