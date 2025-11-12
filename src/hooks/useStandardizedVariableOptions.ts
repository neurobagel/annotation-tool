import { useColumns, useStandardizedVariables } from '~/stores/FreshNewStore';

export interface StandardizedVariableOption {
  id: string;
  label: string;
  disabled: boolean;
}

export function useStandardizedVariableOptions(): StandardizedVariableOption[] {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();

  const singleColumnAssignments = new Set<string>();

  Object.values(columns).forEach((column) => {
    const variableId = column.standardizedVariable;
    if (!variableId) return;

    const variable = standardizedVariables[variableId];
    if (!variable) return;

    const isSingleColumn =
      variable.is_multi_column_measure !== true && variable.can_have_multiple_columns === false;

    if (isSingleColumn) {
      singleColumnAssignments.add(variableId);
    }
  });

  return Object.entries(standardizedVariables).map(([id, variable]) => {
    const isSingleColumn =
      variable.is_multi_column_measure !== true && variable.can_have_multiple_columns === false;

    return {
      id,
      label: variable.name,
      disabled: isSingleColumn && singleColumnAssignments.has(id),
    };
  });
}
