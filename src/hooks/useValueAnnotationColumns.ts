import { DataType, Columns, StandardizedVariables } from '../../datamodel';
import { useColumns, useStandardizedVariables } from '../stores/FreshNewStore';

interface ColumnGroupColumn {
  id: string;
  column: Columns[string];
}

export interface AnnotatedColumnGroup {
  standardizedVariableId: string;
  label: string;
  columns: ColumnGroupColumn[];
}

export type UnannotatedColumnGroupKey = DataType | 'other';

export interface UnannotatedColumnGroup {
  key: UnannotatedColumnGroupKey;
  columns: ColumnGroupColumn[];
}

const emptyUnannotatedGroups = (): Record<UnannotatedColumnGroupKey, ColumnGroupColumn[]> => ({
  [DataType.categorical]: [],
  [DataType.continuous]: [],
  other: [],
});

const getAnnotatedLabel = (variables: StandardizedVariables, id: string) => variables[id].name;

const appendAnnotatedColumn = (
  groups: Record<string, AnnotatedColumnGroup>,
  standardizedVariableId: string,
  label: string,
  entry: ColumnGroupColumn
) => {
  const existing = groups[standardizedVariableId];
  if (existing) {
    return {
      ...groups,
      [standardizedVariableId]: {
        ...existing,
        columns: [...existing.columns, entry],
      },
    };
  }

  return {
    ...groups,
    [standardizedVariableId]: {
      standardizedVariableId,
      label,
      columns: [entry],
    },
  };
};

const appendUnannotatedColumn = (
  groups: Record<UnannotatedColumnGroupKey, ColumnGroupColumn[]>,
  key: UnannotatedColumnGroupKey,
  entry: ColumnGroupColumn
) => ({
  ...groups,
  [key]: [...groups[key], entry],
});

/**
 * Groups columns for the Value Annotation page.
 * - Annotated group: columns grouped by standardized variable ID with labels
 * - Unannotated group: columns grouped by data type (categorical, continuous, other)
 */
export function useValueAnnotationColumns() {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();

  const { annotatedGroups, unannotatedGroups } = Object.entries(columns).reduce(
    (acc, [columnId, column]) => {
      const entry = { id: columnId, column };

      if (column.standardizedVariable) {
        return {
          ...acc,
          annotatedGroups: appendAnnotatedColumn(
            acc.annotatedGroups,
            column.standardizedVariable,
            getAnnotatedLabel(standardizedVariables, column.standardizedVariable),
            entry
          ),
        };
      }

      let groupKey: UnannotatedColumnGroupKey = 'other';
      if (column.dataType === DataType.categorical) {
        groupKey = DataType.categorical;
      } else if (column.dataType === DataType.continuous) {
        groupKey = DataType.continuous;
      }

      return {
        ...acc,
        unannotatedGroups: appendUnannotatedColumn(acc.unannotatedGroups, groupKey, entry),
      };
    },
    {
      annotatedGroups: {} as Record<string, AnnotatedColumnGroup>,
      unannotatedGroups: emptyUnannotatedGroups(),
    }
  );

  const annotatedColumnGroups = Object.values(annotatedGroups);
  const unannotatedColumnGroups: UnannotatedColumnGroup[] = [
    { key: DataType.categorical, columns: unannotatedGroups[DataType.categorical] },
    { key: DataType.continuous, columns: unannotatedGroups[DataType.continuous] },
    { key: 'other', columns: unannotatedGroups.other },
  ];

  return {
    columns,
    annotatedColumnGroups,
    unannotatedColumnGroups,
  };
}

export default useValueAnnotationColumns;
