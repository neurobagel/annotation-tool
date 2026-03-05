import { Box } from '@mui/material';
import { useMemo, useState } from 'react';
import { useColumns, useDataActions, useStandardizedVariables } from '~/stores/data';
import { useColumnCardData } from '../hooks/useColumnCardData';
import { useMultiSelect } from '../hooks/useMultiSelect';
import { useSearchFilter } from '../hooks/useSearchFilter';
import { useStandardizedVariableOptions } from '../hooks/useStandardizedVariableOptions';
import { ColumnAnnotationInstructions } from '../utils/instructions';
import BulkActionBar from './BulkActionBar';
import ColumnAnnotationCard from './ColumnAnnotationCard';
import Instruction from './Instruction';
import SearchFilter from './SearchFilter';
import StandardizedVariablesList from './StandardizedVariablesList';

function ColumnAnnotation() {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();
  const { userUpdatesColumnDescription, userUpdatesMultipleColumnDataTypes } = useDataActions();
  const standardizedVariableOptions = useStandardizedVariableOptions();
  const { searchTerm, debouncedSearchTerm, setSearchTerm, clearSearch } = useSearchFilter(300);

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

  const [selectedSidebarNode, setSelectedSidebarNode] = useState<string | null>(null);

  return (
    <div
      role="presentation"
      className="flex justify-center w-full h-[80vh] overflow-hidden"
      data-cy="column-annotation-container"
    >
      <div className="flex w-full max-w-[1400px] h-full gap-8 px-4">
        {/* Main Column Listing - Left Side */}
        <div className="flex-1 flex flex-col min-w-0 py-4">
          <div className="flex-shrink-0 flex flex-col items-start gap-4 mb-4">
            <Instruction title="Column Annotation" className="mb-0">
              <ColumnAnnotationInstructions />
            </Instruction>
            <div className="w-full flex items-start gap-4">
              <SearchFilter
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onClear={clearSearch}
                placeholder="Filter columns by name..."
                totalCount={columnCardData.length}
                filteredCount={filteredColumnCardData.length}
              />
              <BulkActionBar
                selectedCount={selectedIds.size}
                onClearSelection={clearSelection}
                onAssignDataType={(dataType) =>
                  userUpdatesMultipleColumnDataTypes(Array.from(selectedIds), dataType)
                }
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pb-4 pr-2 w-full" data-cy="scrollable-container">
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
                      inferredDataTypeLabel={columnData.inferredDataTypeLabel}
                      onDescriptionChange={userUpdatesColumnDescription}
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
        {/* Standardized Variables List */}
        <div className="py-4 h-full">
          <StandardizedVariablesList
            selectedItemId={selectedSidebarNode}
            onItemSelect={setSelectedSidebarNode}
          />
        </div>
      </div>
    </div>
  );
}

export default ColumnAnnotation;
