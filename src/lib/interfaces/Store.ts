import { FormField } from './FormField';
import { FormUnits } from './FormUnits';

export interface Store {
  fields: FormField[];
  model: object;
  units: FormUnits;
  errors: object;
  onModelUpdate: (model: object) => void;
  customFields?: any[];
}
