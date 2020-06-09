import _cloneDeep from "lodash.clonedeep";

import { Field, FieldParent, Store } from "../Interfaces";
import {
  getValue,
  setupUnits,
  setupInputs,
  getPathFromAncestors,
  buildPatchFromAncestors,
  getBlankRepeaterRow
} from "../Utils";

export const setup = ({
  model,
  units,
  fields,
  errors,
  customFields,
  onModelUpdate,
  onErrorUpdate
}: Store) => {
  const ModelEffect = (update: any) => (state: Store) => {
    if (update() !== undefined) {
      onModelUpdate(state.model);
      onErrorUpdate(state.errors);
    }
  };

  return {
    initial: {
      model,
      fields,
      errors,
      inputs: setupInputs(customFields),
      units: setupUnits(units)
    },
    Actions: (update: any) => {
      return {
        updateField: (value: any, field: Field, ancestors?: FieldParent[]) => {
          update({
            model: buildPatchFromAncestors(value, field, ancestors),
            errors: { [getPathFromAncestors(field, ancestors)]: undefined }
          });
        },

        addRepeaterRow: (
          rowIndex: number,
          model: object,
          field: Field,
          ancestors?: FieldParent[]
        ) => {
          const blankRow = getBlankRepeaterRow(field);
          const currentRows = _cloneDeep(getValue(model, field, ancestors));

          if (currentRows && currentRows.length) {
            currentRows.splice(rowIndex + 1, 0, blankRow);
            update({
              model: buildPatchFromAncestors(currentRows, field, ancestors)
            });
            return;
          }
          update({
            model: buildPatchFromAncestors([blankRow], field, ancestors)
          });
        },

        removeRepeaterRow: (
          rowIndex: number,
          model: object,
          field: Field,
          ancestors?: FieldParent[]
        ) => {
          const currentRows = _cloneDeep(getValue(model, field, ancestors));

          if (currentRows && currentRows.length > 1) {
            currentRows.splice(rowIndex, 1);
            update({
              model: buildPatchFromAncestors(currentRows, field, ancestors)
            });
            return;
          }

          update({
            model: buildPatchFromAncestors(null, field, ancestors)
          });
        }
      };
    },
    // Effects accepts update and actions as params
    // Actions Not required here so it's ommitted
    Effects: update => [ModelEffect(update)]
  };
};
