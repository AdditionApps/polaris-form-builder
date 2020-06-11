import _cloneDeep from 'lodash.clonedeep';

import {
    ErrorValue,
    Field,
    FieldParent,
    ModelValue,
    State,
    Store,
} from '../Interfaces';
import {
    getValue,
    setupUnits,
    setupInputs,
    getPathFromAncestors,
    buildPatchFromAncestors,
    getBlankRepeaterRow,
} from '../Utils';

interface UpdateableStateFields {
    model: Record<string, ModelValue>;
    errors?: Record<string, ErrorValue>;
}

interface UpdateFunction {
    (state: UpdateableStateFields): State;
}

export const setup = ({
    model,
    units,
    fields,
    errors,
    customFields,
    onModelUpdate,
    onErrorUpdate,
}: Store) => {
    const ModelEffect = (update: UpdateFunction) => (state: State) => {
        if (update(state) !== undefined) {
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
            units: setupUnits(units),
        },
        Actions: (update: UpdateFunction) => {
            return {
                updateField: (
                    value: string | number | [] | null,
                    field: Field,
                    ancestors?: FieldParent[],
                ) => {
                    update({
                        model: buildPatchFromAncestors(value, field, ancestors),
                        errors: {
                            [getPathFromAncestors(field, ancestors)]: undefined,
                        },
                    });
                },

                addRepeaterRow: (
                    rowIndex: number,
                    model: Record<string, ModelValue>,
                    field: Field,
                    ancestors?: FieldParent[],
                ) => {
                    const blankRow = getBlankRepeaterRow(field) as Record<
                        string,
                        ModelValue
                    >;
                    const currentRows = _cloneDeep(
                        getValue(model, field, ancestors),
                    ) as Record<string, ModelValue>[];

                    if (currentRows && currentRows.length) {
                        currentRows.splice(rowIndex + 1, 0, blankRow);
                        update({
                            model: buildPatchFromAncestors(
                                currentRows,
                                field,
                                ancestors,
                            ),
                        });
                        return;
                    }
                    update({
                        model: buildPatchFromAncestors(
                            [blankRow],
                            field,
                            ancestors,
                        ),
                    });
                },

                removeRepeaterRow: (
                    rowIndex: number,
                    model: Record<string, ModelValue>,
                    field: Field,
                    ancestors?: FieldParent[],
                ) => {
                    const currentRows = _cloneDeep(
                        getValue(model, field, ancestors),
                    ) as Record<string, ModelValue>[];

                    if (currentRows && currentRows.length > 1) {
                        currentRows.splice(rowIndex, 1);
                        update({
                            model: buildPatchFromAncestors(
                                currentRows,
                                field,
                                ancestors,
                            ),
                        });
                        return;
                    }

                    update({
                        model: buildPatchFromAncestors(null, field, ancestors),
                    });
                },
            };
        },
        // Effects accepts update and actions as params
        // Actions Not required here so it's ommitted
        Effects: (update: UpdateFunction) => [ModelEffect(update)],
    };
};
