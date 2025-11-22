import { useMemo } from 'react';
import type { DataType } from '../../datamodel';
import { useColumns } from '../stores/FreshNewStore';

export interface ColumnMetadataSummary {
  id: string;
  name: string;
  dataType: DataType | null;
}

/**
 * Returns metadata summaries for a list of column IDs.
 */
export function useColumnsMetadata(columnIds: string[]): Record<string, ColumnMetadataSummary> {
  const columns = useColumns();

  return useMemo(() => {
    const metadata: Record<string, ColumnMetadataSummary> = {};

    columnIds.forEach((columnId) => {
      const column = columns[columnId];
      if (column) {
        metadata[columnId] = {
          id: columnId,
          name: column.name || columnId,
          dataType: column.dataType ?? null,
        };
      }
    });

    return metadata;
  }, [columns, columnIds]);
}

export default useColumnsMetadata;
