import { FormField } from './FormField';
import { FormFieldParent } from './FormFieldParent';

export interface FormFieldProps {
  field: FormField;
  ancestors?: FormFieldParent[];
}
