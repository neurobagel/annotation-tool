import { Typography } from '@mui/material';
import { useMemo } from 'react';
import { useStandardizedVariables, useStandardizedTerms } from '~/stores/data';
import { VariableType, StandardizedVariableItem } from '~/utils/internal_types';
import CollectionItem from './CollectionItem';

interface StandardizedVariablesListProps {
  onItemSelect?: (itemId: string | null) => void;
  selectedItemId?: string | null;
}

function StandardizedVariablesList({
  onItemSelect,
  selectedItemId,
}: StandardizedVariablesListProps) {
  const standardizedVariables = useStandardizedVariables();
  const standardizedTerms = useStandardizedTerms();

  const { demographicVariables, collectionVariables } = useMemo(() => {
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

    demographics.sort((a, b) => a.label.localeCompare(b.label));
    collections.sort((a, b) => a.label.localeCompare(b.label));

    return { demographicVariables: demographics, collectionVariables: collections };
  }, [standardizedVariables, standardizedTerms]);

  const handleSelect = (itemId: string) => {
    if (onItemSelect) {
      onItemSelect(itemId === selectedItemId ? null : itemId);
    }
  };

  return (
    <div
      className="w-[300px] min-w-[300px] max-w-[300px] h-full flex flex-col p-4 bg-white border-r border-gray-200"
      data-cy="standardized-variables-list"
    >
      <Typography variant="h6" className="mb-4 font-bold shrink-0">
        Standardized Variables
      </Typography>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-2">
          {demographicVariables.map((item) => (
            <div key={item.id}>
              <div
                role="button"
                tabIndex={0}
                className={`px-3 py-2 cursor-pointer rounded-md transition-colors ${selectedItemId === item.id ? 'bg-blue-100 text-blue-900 font-medium' : 'hover:bg-gray-100'}`}
                onClick={() => handleSelect(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(item.id);
                  }
                }}
              >
                <Typography variant="body2" className="font-semibold text-gray-700">
                  {item.label}
                </Typography>
              </div>
            </div>
          ))}

          {collectionVariables.map((item) => (
            <CollectionItem
              key={item.id}
              variable={item}
              onTermSelect={handleSelect}
              selectedTermId={selectedItemId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

StandardizedVariablesList.defaultProps = {
  onItemSelect: undefined,
  selectedItemId: null,
};

export default StandardizedVariablesList;
