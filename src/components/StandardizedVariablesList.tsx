import { Typography } from '@mui/material';
import { useMemo } from 'react';
import { useStandardizedVariables, useStandardizedTerms } from '~/stores/data';
import { VariableType, StandardizedVariableListNode } from '~/utils/internal_types';
import CollectionItem from './CollectionItem';

interface StandardizedVariablesListProps {
  onNodeSelect?: (nodeId: string | null) => void;
  selectedNodeId?: string | null;
}

function StandardizedVariablesList({
  onNodeSelect,
  selectedNodeId,
}: StandardizedVariablesListProps) {
  const standardizedVariables = useStandardizedVariables();
  const standardizedTerms = useStandardizedTerms();

  const allNodes = useMemo(() => {
    const nodes: StandardizedVariableListNode[] = [];
    Object.values(standardizedVariables).forEach((stdVar) => {
      const stdVarNode: StandardizedVariableListNode = {
        id: stdVar.id,
        label: stdVar.name,
        terms: [],
      };
      if (stdVar.variable_type === VariableType.collection) {
        const termsForVar = Object.values(standardizedTerms).filter(
          (term) => term.standardizedVariableId === stdVar.id
        );
        termsForVar.sort((a, b) => a.label.localeCompare(b.label));
        if (termsForVar.length > 0) {
          stdVarNode.terms = termsForVar.map((term) => ({
            id: term.id,
            label: term.label,
          }));
        } else {
          delete stdVarNode.terms;
        }
      } else {
        delete stdVarNode.terms;
      }
      nodes.push(stdVarNode);
    });
    nodes.sort((a, b) => {
      const aIsCollection = a.terms ? 1 : 0;
      const bIsCollection = b.terms ? 1 : 0;
      if (aIsCollection !== bIsCollection) {
        return aIsCollection - bIsCollection;
      }
      return a.label.localeCompare(b.label);
    });
    return nodes;
  }, [standardizedVariables, standardizedTerms]);

  const handleSelect = (nodeId: string) => {
    if (onNodeSelect) {
      onNodeSelect(nodeId === selectedNodeId ? null : nodeId);
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
          {allNodes.map((node) =>
            node.terms ? (
              <CollectionItem
                key={node.id}
                node={node}
                onNodeSelect={handleSelect}
                selectedNodeId={selectedNodeId}
              />
            ) : (
              <div key={node.id}>
                <div
                  role="button"
                  tabIndex={0}
                  className={`px-3 py-2 cursor-pointer rounded-md transition-colors ${selectedNodeId === node.id ? 'bg-blue-100 text-blue-900 font-medium' : 'hover:bg-gray-100'}`}
                  onClick={() => handleSelect(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(node.id);
                    }
                  }}
                >
                  <Typography variant="body2" className="font-semibold text-gray-700">
                    {node.label}
                  </Typography>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

StandardizedVariablesList.defaultProps = {
  onNodeSelect: undefined,
  selectedNodeId: null,
};

export default StandardizedVariablesList;
