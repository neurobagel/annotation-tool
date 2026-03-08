import { useMemo } from 'react';
import { StandardizedTermItem, StandardizedVariableItem } from '../utils/internal_types';
import { useStandardizedVariableItems } from './useStandardizedVariableItems';

export function useStandardizedItemDetails(
  itemId: string | null
): StandardizedVariableItem | StandardizedTermItem | null {
  const { demographicVariables, collectionVariables } = useStandardizedVariableItems();

  return useMemo(() => {
    if (!itemId) return null;

    const demographicMatch = demographicVariables.find((v) => v.id === itemId);
    if (demographicMatch) {
      return { type: 'variable', ...demographicMatch };
    }

    const termMatch = collectionVariables
      .map((collection) => (collection.terms || []).find((t) => t.id === itemId))
      .find((match) => match !== undefined);

    return termMatch ? { type: 'term', ...termMatch } : null;
  }, [itemId, demographicVariables, collectionVariables]);
}
