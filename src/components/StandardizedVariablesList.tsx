import { Typography } from '@mui/material';
import { useStandardizedVariableItems } from '~/hooks/useStandardizedVariableItems';
import CollectionItem from './CollectionItem';

interface StandardizedVariablesListProps {
  onItemSelect?: (itemId: string | null) => void;
  selectedItemId?: string | null;
  hasMultipleSelection?: boolean;
}

function StandardizedVariablesList({
  onItemSelect,
  selectedItemId,
  hasMultipleSelection = false,
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
          {demographicVariables.map((item) => {
            const isDisabled = hasMultipleSelection && item.can_have_multiple_columns === false;
            let itemClasses = 'px-3 py-2 rounded-md transition-colors ';
            if (isDisabled) {
              itemClasses += 'opacity-50 cursor-not-allowed bg-gray-50';
            } else if (selectedItemId === item.id) {
              itemClasses += 'bg-blue-100 text-blue-900 font-medium cursor-pointer';
            } else {
              itemClasses += 'hover:bg-gray-100 cursor-pointer';
            }

            return (
              <div key={item.id}>
                <div
                  role="button"
                  tabIndex={isDisabled ? -1 : 0}
                  aria-disabled={isDisabled}
                  className={itemClasses}
                  onClick={() => !isDisabled && handleSelect(item.id)}
                  onKeyDown={(e) => {
                    if (isDisabled) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(item.id);
                    }
                  }}
                  title={
                    isDisabled ? `${item.label} can only be assigned to a single column` : undefined
                  }
                  data-cy={`standardized-variable-item-${item.id}`}
                >
                  <Typography variant="body2" className="font-semibold text-gray-700">
                    {item.label}
                  </Typography>
                </div>
              </div>
            );
          })}

          {collectionVariables.map((item) => (
            <CollectionItem
              key={item.id}
              variable={item}
              onTermSelect={handleSelect}
              selectedTermId={selectedItemId}
              hasMultipleSelection={hasMultipleSelection}
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
  hasMultipleSelection: false,
};

export default StandardizedVariablesList;
