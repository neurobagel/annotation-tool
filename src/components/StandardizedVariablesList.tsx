import { Typography } from '@mui/material';
import { useStandardizedVariableItems } from '~/hooks/useStandardizedVariableItems';
import CollectionItem from './CollectionItem';

interface StandardizedVariablesListProps {
  onItemSelect?: (itemId: string | null) => void;
  selectedItemId?: string | null;
}

function StandardizedVariablesList({
  onItemSelect,
  selectedItemId,
}: StandardizedVariablesListProps) {
  const { demographicVariables, collectionVariables } = useStandardizedVariableItems();

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
