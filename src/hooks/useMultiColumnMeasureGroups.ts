import { useColumns, useStandardizedTerms } from '../stores/FreshNewStore';

export interface MultiColumnMeasureGroup {
  termId: string | null;
  label: string;
  columnIds: string[];
}

/**
 * Groups columns mapped to a multi-column measure standardized variable by their isPartOf term.
 */
export function useMultiColumnMeasureGroups(variableId: string): MultiColumnMeasureGroup[] {
  const columns = useColumns();
  const standardizedTerms = useStandardizedTerms();

  const grouped = Object.entries(columns).reduce<Record<string, MultiColumnMeasureGroup>>(
    (acc, [columnId, column]) => {
      if (column.standardizedVariable !== variableId) {
        return acc;
      }

      const termId = column.isPartOf ?? null;
      const label = termId ? standardizedTerms[termId].label : 'Ungrouped';
      const key = termId ?? 'ungrouped';
      const existing = acc[key];

      if (existing) {
        return {
          ...acc,
          [key]: { ...existing, columnIds: [...existing.columnIds, columnId] },
        };
      }

      return {
        ...acc,
        [key]: {
          termId,
          label,
          columnIds: [columnId],
        },
      };
    },
    {}
  );

  return Object.values(grouped);
}

export default useMultiColumnMeasureGroups;
