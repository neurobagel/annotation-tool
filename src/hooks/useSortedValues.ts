import naturalCompare from 'natural-compare-lite';
import { useMemo } from 'react';

export type SortBy = 'value' | 'missing';
export type SortDir = 'asc' | 'desc';

export function useSortedValues(
  uniqueValues: string[],
  missingValues: string[],
  sortBy: SortBy,
  sortDir: SortDir
) {
  const sortedValues = useMemo(() => {
    const missingSet = new Set(missingValues);

    return [...uniqueValues].sort((a, b) => {
      if (sortBy === 'missing') {
        const aIsMissing = missingSet.has(a);
        const bIsMissing = missingSet.has(b);

        if (aIsMissing !== bIsMissing) {
          if (sortDir === 'asc') {
            return aIsMissing ? -1 : 1;
          }
          return aIsMissing ? 1 : -1;
        }
        return naturalCompare(a, b);
      }
      return sortDir === 'asc' ? naturalCompare(a, b) : naturalCompare(b, a);
    });
  }, [uniqueValues, missingValues, sortBy, sortDir]);

  return { sortedValues, visibleValues: sortedValues };
}

export default useSortedValues;
