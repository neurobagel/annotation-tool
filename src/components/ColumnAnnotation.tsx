import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useState } from 'react';
import { useColumns, useDataActions, useStandardizedVariables } from '~/stores/data';
import { useStandardizedVariableOptions } from '../hooks/useStandardizedVariableOptions';
import { ColumnAnnotationInstructions } from '../utils/instructions';
import { DataType } from '../utils/internal_types';
import ColumnAnnotationCard from './ColumnAnnotationCard';
import Instruction from './Instruction';

// Defined filter type for Issue #429
type VisibilityFilter = 'unannotated' | 'annotated' | 'all';

function ColumnAnnotation() {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();
  const {
    userUpdatesColumnDescription,
    userUpdatesColumnStandardizedVariable,
    userUpdatesColumnDataType,
  } = useDataActions();
  const standardizedVariableOptions = useStandardizedVariableOptions();

  // --- UI States ---
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('unannotated');

  const handleFilterChange = (
    _: React.MouseEvent<HTMLElement>,
    newFilter: VisibilityFilter | null
  ) => {
    if (newFilter !== null) {
      setVisibilityFilter(newFilter);
    }
  };

  const columnsArray = Object.entries(columns);

  const handleStandardizedVariableChange = (columnId: string, newId: string | null) => {
    userUpdatesColumnStandardizedVariable(columnId, newId);
  };

  const handleDataTypeChange = (
    columnId: string,
    newDataType: 'Categorical' | 'Continuous' | null
  ) => {
    let dataType: DataType | null;
    if (newDataType === 'Categorical') {
      dataType = DataType.categorical;
    } else if (newDataType === 'Continuous') {
      dataType = DataType.continuous;
    } else {
      dataType = null;
    }
    userUpdatesColumnDataType(columnId, dataType);
  };

  // Base mapped data
  const columnCardData = columnsArray.map(([columnId, column]) => {
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
  });

  // Calculate metrics for Issue #429
  const totalColumns = columnCardData.length;
  const annotatedCount = columnCardData.filter((col) => col.standardizedVariableId !== null).length;
  const remainingCount = totalColumns - annotatedCount;

  // Filter logic for Issue #429
  const filteredColumnCardData = columnCardData.filter((data) => {
    const isAnnotated = data.standardizedVariableId !== null;
    if (visibilityFilter === 'unannotated') return !isAnnotated;
    if (visibilityFilter === 'annotated') return isAnnotated;
    return true; // 'all'
  });

  return (
    <div
      className="flex flex-col items-center gap-6 h-[70vh] overflow-hidden"
      data-cy="column-annotation-container"
    >
      <div className="w-full max-w-6xl flex flex-col h-full">
        {/* HEADER SECTION */}
        <div className="p-4 flex-shrink-0 flex flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <Instruction title="Column Annotation" className="mb-0">
              <ColumnAnnotationInstructions />
            </Instruction>
          </div>
        </div>

        {/* --- START: VISIBILITY TOGGLE (Issue #429) --- */}
        <Box className="flex flex-row justify-between items-center px-4 mb-2">
          <Typography variant="body2" className="text-gray-600 font-medium">
            <strong>{remainingCount}</strong> columns remaining | <strong>{annotatedCount}</strong>{' '}
            columns annotated
          </Typography>

          <ToggleButtonGroup
            value={visibilityFilter}
            exclusive
            onChange={handleFilterChange}
            aria-label="column visibility filter"
            size="small"
            className="bg-white"
          >
            <ToggleButton
              value="unannotated"
              aria-label="show unannotated only"
              className="text-xs px-3"
            >
              Unannotated Only
            </ToggleButton>
            <ToggleButton
              value="annotated"
              aria-label="show annotated only"
              className="text-xs px-3"
            >
              Annotated Only
            </ToggleButton>
            <ToggleButton value="all" aria-label="show all columns" className="text-xs px-3">
              Show All
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {/* --- END: VISIBILITY TOGGLE --- */}

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
              <Box className="text-center py-8 text-gray-500 italic">
                No columns match the current filter.
              </Box>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColumnAnnotation;
