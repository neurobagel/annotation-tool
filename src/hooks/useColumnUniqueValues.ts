import { useColumns } from '../stores/FreshNewStore';

/**
 * Returns unique column values for.
 */
export function useColumnUniqueValues(columnId: string): string[] {
  const column = useColumns()[columnId];
  return Array.from(new Set(column.allValues));
}

export default useColumnUniqueValues;
