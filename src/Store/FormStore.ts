import _cloneDeep from 'lodash.clonedeep';
import { ErrorValue, Field, FieldParent, State, Store } from '../Interfaces';
import {
    getValue,
    setupUnits,
    setupInputs,
    getPathFromAncestors,
    buildPatchFromAncestors,
    getBlankRepeaterRow,
} from '../Utils';

interface UpdateableStateFields {
    model?: any;
    errors?: Record<string, ErrorValue>;
    focus?: string | null;
}

interface UpdateFunction {
    (state?: UpdateableStateFields): State;
}

export const setup = ({
    model,
    units,
    fields,
    errors,
    focus,
    customFields,
    onModelUpdate,
    onErrorUpdate,
    onFocusUpdate,
}: Store) => {
    const ModelEffect = (update: UpdateFunction) => (state: State) => {
        if (update() !== undefined) {
            onModelUpdate(state.model);
            onErrorUpdate(state.errors);
            onFocusUpdate(state.focus);
        }
    };

    return {
        initial: {
            model,
            fields,
            errors,
            focus,
            inputs: setupInputs(customFields),
            units: setupUnits(units),
        },
        Actions: (update: UpdateFunction) => {
            return {
                updateField: (
                    value: any,
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

                setFocus: (field: Field, ancestors?: FieldParent[]) => {
                    update({
                        focus: getPathFromAncestors(field, ancestors),
                    });
                },

                addRepeaterRow: (
                    rowIndex: number,
                    model: any,
                    field: Field,
                    ancestors?: FieldParent[],
                ) => {
                    const blankRow = getBlankRepeaterRow(field) as Record<
                        string,
                        unknown
                    >;
                    const currentRows = _cloneDeep(
                        getValue(model, field, ancestors),
                    ) as Record<string, unknown>[];

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
                    model: any,
                    field: Field,
                    ancestors?: FieldParent[],
                ) => {
                    const currentRows = _cloneDeep(
                        getValue(model, field, ancestors),
                    ) as Record<string, unknown>[];

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
