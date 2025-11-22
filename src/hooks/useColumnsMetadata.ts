import { useMemo } from 'react';
import type { DataType } from '../../datamodel';
import { useColumns, useStandardizedVariables } from '../stores/FreshNewStore';

export interface ColumnMetadataSummary {
  id: string;
  name: string;
  dataType: DataType | null;
  isMultiColumnMeasure: boolean;
}

/**
 * Returns metadata summaries for a list of column IDs.
 */
export function useColumnsMetadata(columnIds: string[]): Record<string, ColumnMetadataSummary> {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();

  return useMemo(() => {
    const metadata: Record<string, ColumnMetadataSummary> = {};

    columnIds.forEach((columnId) => {
      const column = columns[columnId];
      if (column) {
        const standardizedVariableId = column.standardizedVariable ?? null;
        const isMultiColumnMeasure = standardizedVariableId
          ? Boolean(standardizedVariables[standardizedVariableId]?.is_multi_column_measure)
          : false;

        metadata[columnId] = {
          id: columnId,
          name: column.name || columnId,
          dataType: column.dataType ?? null,
          isMultiColumnMeasure,
        };
      }
    });

    return metadata;
  }, [columns, columnIds, standardizedVariables]);
}

export default useColumnsMetadata;
