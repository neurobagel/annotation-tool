import { useMemo } from 'react';
import { useStandardizedTerms } from '../stores/data';
import type { StandardizedTerms } from '../utils/internal_types';
import { useAnnotatedVariables } from './useAnnotatedVariables';
import type { ColumnGroupColumn, UnannotatedColumnGroup } from './useValueAnnotationColumns';
import { useValueAnnotationColumns } from './useValueAnnotationColumns';

interface CollectionGroupedColumns {
  label: string;
  columns: ColumnGroupColumn[];
}

export interface ValueAnnotationNavAnnotatedGroup {
  standardizedVariableId: string;
  label: string;
  columns: ColumnGroupColumn[];
  isCollection: boolean;
  groupedColumns: CollectionGroupedColumns[];
}

export interface ValueAnnotationNavData {
  annotatedGroups: ValueAnnotationNavAnnotatedGroup[];
  unannotatedGroups: UnannotatedColumnGroup[];
}

const buildCollectionGroups = (
  columns: ColumnGroupColumn[],
  standardizedTerms: StandardizedTerms
): CollectionGroupedColumns[] => {
  const grouped = columns.reduce<Record<string, CollectionGroupedColumns>>((acc, entry) => {
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
      multiColumnFlags[variableGroup.standardizedVariableId] = variableGroup.isCollection;
    });

    const annotatedGroups = annotatedColumnGroups.map<ValueAnnotationNavAnnotatedGroup>((group) => {
      const isCollection = multiColumnFlags[group.standardizedVariableId] ?? false;

      const groupedColumns = isCollection
        ? buildCollectionGroups(group.columns, standardizedTerms)
        : [];

      return {
        ...group,
        isCollection,
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
