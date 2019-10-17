import { IField } from "./IField";
import { IUnits } from "./IUnits";

export interface IStore {
  fields: IField[];
  model: object;
  units: IUnits;
  errors: object;
  onModelUpdate: (model: object) => void;
}
