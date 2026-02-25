import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography, Button } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useColumns, useDataActions, useStandardizedVariables } from '~/stores/data';
import { useColumnCardData } from '../hooks/useColumnCardData';
import { useMultiSelect } from '../hooks/useMultiSelect';
import { useSearchFilter } from '../hooks/useSearchFilter';
import { useStandardizedVariableOptions } from '../hooks/useStandardizedVariableOptions';
import { ColumnAnnotationInstructions } from '../utils/instructions';
import { DataType } from '../utils/internal_types';
import ColumnAnnotationCard from './ColumnAnnotationCard';
import Instruction from './Instruction';
import SearchFilter from './SearchFilter';

function ColumnAnnotation() {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();
  const {
    userUpdatesColumnDescription,
    userUpdatesColumnStandardizedVariable,
    userUpdatesColumnDataType,
  } = useDataActions();
  const standardizedVariableOptions = useStandardizedVariableOptions();
  const { searchTerm, debouncedSearchTerm, setSearchTerm, clearSearch } = useSearchFilter(300);

  const handleStandardizedVariableChange = useCallback(
    (columnId: string, newId: string | null) => {
      userUpdatesColumnStandardizedVariable(columnId, newId);
    },
    [userUpdatesColumnStandardizedVariable]
  );

  const handleDataTypeChange = useCallback(
    (columnId: string, newDataType: 'Categorical' | 'Continuous' | null) => {
      let dataType: DataType | null;
      if (newDataType === 'Categorical') {
        dataType = DataType.categorical;
      } else if (newDataType === 'Continuous') {
        dataType = DataType.continuous;
      } else {
        dataType = null;
      }
      userUpdatesColumnDataType(columnId, dataType);
    },
    [userUpdatesColumnDataType]
  );

  const columnCardData = useColumnCardData(columns, standardizedVariables);

  // Memoize the filtering logic to ensure that we only apply the .filter() operation
  // when the actual data changes OR when the 300ms debounce timer finishes, preventing
  // sluggish filtering on every keystroke
  const filteredColumnCardData = useMemo(() => {
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    if (!lowerSearchTerm) return columnCardData;

    return columnCardData.filter((col) => col.name.toLowerCase().includes(lowerSearchTerm));
  }, [columnCardData, debouncedSearchTerm]);

  const visibleColumnIds = useMemo(
    () => filteredColumnCardData.map((col) => col.columnId),
    [filteredColumnCardData]
  );

  const { selectedIds, handleSelect, clearSelection, isSelected } =
    useMultiSelect(visibleColumnIds);

  return (
    <div
      role="presentation"
      className="flex flex-col items-center gap-6 h-[70vh] overflow-hidden"
      data-cy="column-annotation-container"
      onClick={(e) => {
        const target = e.target as HTMLElement;
        const currentTarget = e.currentTarget as HTMLElement;

        // Ignore clicks on anything that is interactive or inside a card
        const isInteractive = target.closest(
          'input, button, a, textarea, [role="button"], [role="option"], [role="tooltip"], [role="combobox"], [role="listbox"], .MuiAutocomplete-root, .MuiInputBase-root, .MuiToggleButtonGroup-root'
        );

        if (isInteractive && isInteractive !== currentTarget) {
          return;
        }

        clearSelection();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          clearSelection();
        }
      }}
    >
      <div className="w-full max-w-6xl flex flex-col h-full">
        <div className="p-4 flex-shrink-0 flex flex-col items-start gap-4">
          <Instruction title="Column Annotation" className="mb-0">
            <ColumnAnnotationInstructions />
          </Instruction>
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={clearSearch}
            placeholder="Filter columns by name..."
            totalCount={columnCardData.length}
            filteredCount={filteredColumnCardData.length}
          />
          {selectedIds.size > 0 && (
            <div className="w-full">
              <Box
                className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-3 shadow-sm w-full transition-all mt-2"
                data-cy="action-bar"
              >
                <div className="w-full flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Typography variant="subtitle1" className="font-semibold text-primary-700">
                      {selectedIds.size} column{selectedIds.size !== 1 ? 's' : ''} selected
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      color="inherit"
                      onClick={clearSelection}
                      startIcon={<CloseIcon fontSize="small" />}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </Box>
            </div>
          )}
        </div>

        <div
          className="flex-1 overflow-y-auto px-4 pb-4 w-full max-w-6xl"
          data-cy="scrollable-container"
        >
          {/* Global Header Row - Sticky */}
          <Box className="sticky top-0 z-10 mb-4 border border-gray-200 shadow-sm rounded-t-lg backdrop-blur-sm bg-opacity-95 bg-gray-100 grid grid-cols-[6fr_1fr_3fr] gap-4 px-4 pt-3 pb-1 items-end min-w-[768px]">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Description
            </span>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Data Type
            </span>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Mapped Variable
            </span>
          </Box>

          <div className="space-y-3">
            {filteredColumnCardData.length > 0 ? (
              filteredColumnCardData.map((columnData) => (
                <div key={columnData.columnId} className="w-full">
                  <ColumnAnnotationCard
                    id={columnData.columnId}
                    name={columnData.name}
                    description={columnData.description}
                    dataType={columnData.dataType}
                    standardizedVariableId={columnData.standardizedVariableId}
                    standardizedVariableOptions={standardizedVariableOptions}
                    isDataTypeEditable={columnData.isDataTypeEditable}
                    inferredDataTypeLabel={columnData.inferredDataTypeLabel}
                    onDescriptionChange={userUpdatesColumnDescription}
                    onDataTypeChange={handleDataTypeChange}
                    onStandardizedVariableChange={handleStandardizedVariableChange}
                    selected={isSelected(columnData.columnId)}
                    onSelect={(e) =>
                      handleSelect(columnData.columnId, e.shiftKey, e.ctrlKey || e.metaKey)
                    }
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500" data-cy="no-columns-found-message">
                No columns found matching &quot;{debouncedSearchTerm}&quot;
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColumnAnnotation;
