/**
 * Hook to generate DataTable from the Columns in the store.
 */
import { DataTable } from '~/utils/internal_types';
import { useColumns } from '../stores/data';

export function useDataTable(): DataTable {
  const columns = useColumns();
  const dataTable: DataTable = {};

  Object.keys(columns).forEach((columnId) => {
    const column = columns[columnId];
    dataTable[column.name] = column.allValues;
  });

  return dataTable;
}
