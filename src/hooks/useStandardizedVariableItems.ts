import { useMemo } from 'react';
import { useStandardizedVariables, useStandardizedTerms } from '~/stores/data';
import { VariableType, StandardizedVariableItem } from '~/utils/internal_types';

export function useStandardizedVariableItems() {
  const standardizedVariables = useStandardizedVariables();
  const standardizedTerms = useStandardizedTerms();

  return useMemo(() => {
    const termsByVariableId = Object.values(standardizedTerms).reduce(
      (acc, term) => {
        const currentTerms = acc[term.standardizedVariableId] || [];
        return {
          ...acc,
          [term.standardizedVariableId]: [...currentTerms, { id: term.id, label: term.label }],
        };
      },
      {} as Record<string, { id: string; label: string }[]>
    );

    const demographics: StandardizedVariableItem[] = [];
    const collections: StandardizedVariableItem[] = [];

    Object.values(standardizedVariables).forEach((stdVar) => {
      if (stdVar.variable_type !== VariableType.collection) {
        demographics.push({
          id: stdVar.id,
          label: stdVar.name,
        } as StandardizedVariableItem);
      } else {
        const termsForVar = termsByVariableId[stdVar.id] || [];
        termsForVar.sort((a, b) => a.label.localeCompare(b.label));

        const stdVarItem: StandardizedVariableItem = {
          id: stdVar.id,
          label: stdVar.name,
        };

        if (termsForVar.length > 0) {
          stdVarItem.terms = termsForVar;
        }
        collections.push(stdVarItem);
      }
    });

    return { demographicVariables: demographics, collectionVariables: collections };
  }, [standardizedVariables, standardizedTerms]);
}
