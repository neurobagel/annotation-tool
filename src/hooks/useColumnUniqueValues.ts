import { useMemo } from 'react';
import { useColumns } from '../stores/FreshNewStore';

/**
 * Returns the unique values for a column.
 */
export function useColumnUniqueValues(columnId: string): string[] {
  const column = useColumns()[columnId];
  const allValues = column?.allValues;

  return useMemo(() => {
    if (!allValues) {
      return [];
    }

    return Array.from(new Set(allValues));
  }, [allValues]);
}

export default useColumnUniqueValues;
