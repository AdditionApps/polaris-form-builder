import { FormField } from '../interfaces';
import _cloneDeep from 'lodash.clonedeep';

export const transformFields = (fields: FormField[], callback: (FormField) => FormField) => {
  return fields.map((field: FormField) => {
    return _cloneDeep(callback(field));
  });
};
