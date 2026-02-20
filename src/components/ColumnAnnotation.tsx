import { Box } from '@mui/material';
import { useCallback, useMemo } from 'react';
import { useColumns, useDataActions, useStandardizedVariables } from '~/stores/data';
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

  // Memoize the heavy mapping to prevent re-calculating the entire list of columns
  // on every keystroke in the search filter which causes a re-render.
  const columnCardData = useMemo(
    () =>
      Object.entries(columns).map(([columnId, column]) => {
        // Data type is editable when:
        // 1. No standardized variable is selected, OR
        // 2. The selected standardized variable is a multi-column measure
        const selectedStandardizedVariable = column.standardizedVariable
          ? standardizedVariables[column.standardizedVariable]
          : undefined;
        const isDataTypeEditable =
          !column.standardizedVariable ||
          selectedStandardizedVariable?.is_multi_column_measure === true;

        const inferredDataTypeLabel = isDataTypeEditable
          ? null
          : selectedStandardizedVariable?.variable_type || column.dataType || null;

        return {
          columnId,
          name: column.name,
          description: column.description || null,
          dataType: column.dataType || null,
          standardizedVariableId: column.standardizedVariable || null,
          isDataTypeEditable,
          inferredDataTypeLabel,
        };
      }),
    [columns, standardizedVariables]
  );

  // Memoize the filtering logic to ensure that we only apply the .filter() operation
  // when the actual data changes OR when the 300ms debounce timer finishes, preventing
  // sluggish filtering on every keystroke
  const filteredColumnCardData = useMemo(() => {
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
    if (!lowerSearchTerm) return columnCardData;

    return columnCardData.filter((col) => col.name.toLowerCase().includes(lowerSearchTerm));
  }, [columnCardData, debouncedSearchTerm]);

  return (
    <div
      className="flex flex-col items-center gap-6 h-[70vh] overflow-hidden"
      data-cy="column-annotation-container"
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
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4" data-cy="scrollable-container">
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
