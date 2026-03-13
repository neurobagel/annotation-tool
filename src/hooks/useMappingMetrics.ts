import { useMemo } from 'react';
import { useColumns } from '~/stores/data';

export interface MappingMetrics {
  totalColumnsCount: number;
  annotatedColumnsCount: number;
  mappedVariableCounts: Record<string, number>;
  mappedTermCounts: Record<string, number>;
}

export function useMappingMetrics(): MappingMetrics {
  const columns = useColumns();

  return useMemo(() => {
    const columnValues = Object.values(columns);
    const numOfColumns = columnValues.length;
    let annotatedColumnsCount = 0;
    const mappedVariableCounts: Record<string, number> = {};
    const mappedTermCounts: Record<string, number> = {};

    columnValues.forEach((col) => {
      const isAnnotated =
        (col.standardizedVariable !== undefined && col.standardizedVariable !== null) ||
        (col.isPartOf !== undefined && col.isPartOf !== null);

      if (isAnnotated) {
        annotatedColumnsCount += 1;
      }

      if (col.standardizedVariable) {
        mappedVariableCounts[col.standardizedVariable] =
          (mappedVariableCounts[col.standardizedVariable] || 0) + 1;
      }
      if (col.isPartOf) {
        mappedTermCounts[col.isPartOf] = (mappedTermCounts[col.isPartOf] || 0) + 1;
      }
    });

    return {
      totalColumnsCount: numOfColumns,
      annotatedColumnsCount,
      mappedVariableCounts,
      mappedTermCounts,
    };
  }, [columns]);
}
