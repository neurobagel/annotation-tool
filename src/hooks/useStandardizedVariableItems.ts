import { useMemo } from 'react';
import { useStandardizedVariables, useStandardizedTerms } from '~/stores/data';
import {
  VariableType,
  StandardizedVariableItem,
  StandardizedTermItem,
} from '~/utils/internal_types';

export function useStandardizedVariableItems() {
  const standardizedVariables = useStandardizedVariables();
  const standardizedTerms = useStandardizedTerms();

  return useMemo(() => {
    const termsByVariableId: Record<string, StandardizedTermItem[]> = {};
    Object.values(standardizedTerms).forEach((term) => {
      if (!termsByVariableId[term.standardizedVariableId]) {
        termsByVariableId[term.standardizedVariableId] = [];
      }
      termsByVariableId[term.standardizedVariableId].push({
        id: term.id,
        label: term.label,
        abbreviation: term.abbreviation,
      });
    });

    const demographics: StandardizedVariableItem[] = [];
    const collections: StandardizedVariableItem[] = [];

    Object.values(standardizedVariables).forEach((stdVar) => {
      if (stdVar.variable_type !== VariableType.collection) {
        demographics.push({
          id: stdVar.id,
          label: stdVar.name,
          can_have_multiple_columns: stdVar.can_have_multiple_columns,
        } as StandardizedVariableItem);
      } else {
        const termsForVar = termsByVariableId[stdVar.id] || [];
        termsForVar.sort((a, b) => a.label.localeCompare(b.label));

        const stdVarItem: StandardizedVariableItem = {
          id: stdVar.id,
          label: stdVar.name,
          can_have_multiple_columns: stdVar.can_have_multiple_columns,
          terms: termsForVar,
        };

        collections.push(stdVarItem);
      }
    });

    return { demographicVariables: demographics, collectionVariables: collections };
  }, [standardizedVariables, standardizedTerms]);
}
