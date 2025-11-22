import { useStandardizedTerms } from '../stores/FreshNewStore';

export interface TermOption {
  id: string;
  label: string;
  abbreviation?: string;
}

/**
 * Returns standardized term options scoped to a variable.
 */
export function useTermOptions(variableId: string): TermOption[] {
  const standardizedTerms = useStandardizedTerms();

  return Object.values(standardizedTerms)
    .filter((term) => term.standardizedVariableId === variableId)
    .map((term) => ({
      id: term.id,
      label: term.label,
      abbreviation: term.abbreviation,
    }));
}

export default useTermOptions;
