import { FormField } from '../interfaces';

export const transformFields = (fields: FormField[], callback: (FormField) => FormField) => {
  return fields.map((field: FormField) => {
    return { ...callback(field) };
  });
};
