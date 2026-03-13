import { Typography, Box } from '@mui/material';
import { useStandardizedVariableItems } from '~/hooks/useStandardizedVariableItems';
import CollectionItem from './CollectionItem';

interface StandardizedVariablesListProps {
  onItemSelect?: (itemId: string | null) => void;
  selectedItemId?: string | null;
  hasMultipleSelection?: boolean;
  annotatedColumnsCount: number;
  totalColumnsCount: number;
  mappedVariableCounts: Record<string, number>;
  mappedTermCounts: Record<string, number>;
}

function StandardizedVariablesList({
  onItemSelect,
  selectedItemId,
  hasMultipleSelection = false,
  annotatedColumnsCount,
  totalColumnsCount,
  mappedVariableCounts,
  mappedTermCounts,
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
      <div className="flex flex-col mb-4 shrink-0">
        <Typography variant="h6" className="font-bold">
          Standardized Variables
        </Typography>
        <Typography className="font-medium tracking-wide mt-1">
          {annotatedColumnsCount}/{totalColumnsCount} Annotated
        </Typography>
      </div>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-2">
          {demographicVariables.map((item) => {
            const isDisabled =
              (hasMultipleSelection || (mappedVariableCounts[item.id] || 0) > 0) &&
              item.can_have_multiple_columns === false;
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
                  className={`${itemClasses}  flex items-center justify-between`}
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
                  <Typography variant="body2" className="font-semibold text-gray-700 truncate">
                    {item.label}
                  </Typography>
                  {mappedVariableCounts[item.id] > 0 && (
                    <Box
                      component="span"
                      sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}
                      className="ml-2 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium"
                      data-cy={`mapped-count-badge-${item.id}`}
                    >
                      {mappedVariableCounts[item.id]}
                    </Box>
                  )}
                </div>
              </div>
            );
          })}

          {/* 
            TODO or NOTE: We currently pass the entire `mappedTermCounts` record to each CollectionItem, 
            relying on `term.id` being globally unique across all collections. 
            If/when we introduce multiple Collection-type variables, we should scope `mappedTermCounts` 
            by the parent `item.id` to avoid term ID collisions between different collections.
          */}
          {collectionVariables.map((item) => (
            <CollectionItem
              key={item.id}
              variable={item}
              onTermSelect={handleSelect}
              selectedTermId={selectedItemId}
              hasMultipleSelection={hasMultipleSelection}
              totalCollectionMappedCount={mappedVariableCounts[item.id] || 0}
              mappedTermCounts={mappedTermCounts}
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
