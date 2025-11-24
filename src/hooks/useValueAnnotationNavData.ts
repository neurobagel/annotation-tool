import { useMemo } from 'react';
import type { StandardizedTerms } from '../../internal_types';
import { useStandardizedTerms } from '../stores/data';
import { useAnnotatedVariables } from './useAnnotatedVariables';
import type { ColumnGroupColumn, UnannotatedColumnGroup } from './useValueAnnotationColumns';
import { useValueAnnotationColumns } from './useValueAnnotationColumns';

interface MultiColumnGroupedColumns {
  label: string;
  columns: ColumnGroupColumn[];
}

export interface ValueAnnotationNavAnnotatedGroup {
  standardizedVariableId: string;
  label: string;
  columns: ColumnGroupColumn[];
  isMultiColumnMeasure: boolean;
  groupedColumns: MultiColumnGroupedColumns[];
}

export interface ValueAnnotationNavData {
  annotatedGroups: ValueAnnotationNavAnnotatedGroup[];
  unannotatedGroups: UnannotatedColumnGroup[];
}

const buildMultiColumnGroups = (
  columns: ColumnGroupColumn[],
  standardizedTerms: StandardizedTerms
): MultiColumnGroupedColumns[] => {
  const grouped = columns.reduce<Record<string, MultiColumnGroupedColumns>>((acc, entry) => {
    const termId =
      typeof entry.column.isPartOf === 'string' && entry.column.isPartOf.length > 0
        ? entry.column.isPartOf
        : null;

    const key = termId ?? 'ungrouped';
    const label = termId ? (standardizedTerms[termId]?.label ?? 'Ungrouped') : 'Ungrouped';

    const existing = acc[key];

    if (existing) {
      existing.columns.push(entry);
      return acc;
    }

    return {
      ...acc,
      [key]: {
        label,
        columns: [entry],
      },
    };
  }, {});

  return Object.values(grouped);
};

/**
 * Aggregates annotated and unannotated column groups for the Value Annotation sidebar,
 * including multi-column measure grouping metadata.
 */
export function useValueAnnotationNavData(): ValueAnnotationNavData {
  const { annotatedColumnGroups, unannotatedColumnGroups } = useValueAnnotationColumns();
  const annotatedVariables = useAnnotatedVariables();
  const standardizedTerms = useStandardizedTerms();

  return useMemo(() => {
    const multiColumnFlags: Record<string, boolean> = {};
    annotatedVariables.forEach((variableGroup) => {
      multiColumnFlags[variableGroup.standardizedVariableId] = variableGroup.isMultiColumnMeasure;
    });

    const annotatedGroups = annotatedColumnGroups.map<ValueAnnotationNavAnnotatedGroup>((group) => {
      const isMultiColumnMeasure = multiColumnFlags[group.standardizedVariableId] ?? false;

      const groupedColumns = isMultiColumnMeasure
        ? buildMultiColumnGroups(group.columns, standardizedTerms)
        : [];

      return {
        ...group,
        isMultiColumnMeasure,
        groupedColumns,
      };
    });

    return {
      annotatedGroups,
      unannotatedGroups: unannotatedColumnGroups,
    };
  }, [annotatedColumnGroups, annotatedVariables, standardizedTerms, unannotatedColumnGroups]);
}

export default useValueAnnotationNavData;
