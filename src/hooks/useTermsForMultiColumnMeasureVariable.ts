import { useStandardizedTerms } from '../stores/data';
import { AvailableTerm } from '../types/multiColumnMeasureTypes';

/**
 * Returns the terms for a multi-column variable and flags those already mapped
 * via the `collectionCreatedAt` field so the UI can disable them when creating new cards.
 */
export function useTermsForMultiColumnMeasureVariable(variableId: string): AvailableTerm[] {
  const standardizedTerms = useStandardizedTerms();

  if (!variableId) return [];

  return Object.values(standardizedTerms)
    .filter((term) => term.standardizedVariableId === variableId)
    .map((term) => ({
      id: term.id,
      label: term.label,
      abbreviation: term.abbreviation,
      description: term.description,
      disabled: Boolean(term.collectionCreatedAt),
    }));
}
