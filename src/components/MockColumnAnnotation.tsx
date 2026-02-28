import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  pointerWithin,
} from '@dnd-kit/core';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Typography, Button } from '@mui/material';
import { useState, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import assessmentData from '../assets/default_config/assessment.json';
import { DataType } from '../utils/internal_types';
import ColumnAnnotationCard from './ColumnAnnotationCard';
import MockActionBar from './MockActionBar';
import MockTaxonomySidebar, { TaxonomyNode } from './MockTaxonomySidebar';
import SearchFilter from './SearchFilter';

const ALL_TERMS = assessmentData.flatMap((vocab) =>
  vocab.terms.map((term) => ({
    id: term.id,
    label: term.name,
    abbreviation: term.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .substring(0, 4),
  }))
);

const TERM_BY_ID = new Map(ALL_TERMS.map((t) => [t.id, t]));

// -- Mock Data Definitions --

const MOCK_COLUMNS: any = {
  sub_id: {
    id: 'sub_id',
    name: 'Subject ID',
    description: 'Unique identifier for the participant',
    dataType: null,
    standardizedVariable: null,
    term: null,
  },
  age: {
    id: 'age',
    name: 'Age',
    description: 'Age of the participant in years',
    dataType: null,
    standardizedVariable: null,
    term: null,
  },
  sex: {
    id: 'sex',
    name: 'Sex',
    description: 'Biological sex',
    dataType: null,
    standardizedVariable: null,
    term: null,
  },
  group: {
    id: 'group',
    name: 'Group',
    description: 'Study group assignment (Control/Patient)',
    dataType: null,
    standardizedVariable: null,
    term: null,
  },
  wisc_vocab: {
    id: 'wisc_vocab',
    name: 'WISC_Vocab_Score',
    description: '',
    dataType: null,
    standardizedVariable: null,
    term: null,
  },
  wisc_matrix: {
    id: 'wisc_matrix',
    name: 'WISC_Matrix_Reasoning',
    description: '',
    dataType: null,
    standardizedVariable: null,
    term: null,
  },
  updrs_1: {
    id: 'updrs_1',
    name: 'UPDRS_Part_I',
    description: 'UPDRS Part I Total Score',
    dataType: null,
    standardizedVariable: null,
    term: null,
  },
  updrs_2: {
    id: 'updrs_2',
    name: 'UPDRS_Part_II',
    description: '',
    dataType: null,
    standardizedVariable: null,
    term: null,
  },
  moca_total: {
    id: 'moca_total',
    name: 'MoCA_Total',
    description: 'Montreal Cognitive Assessment Total Score',
    dataType: null,
    standardizedVariable: null,
    term: null,
  },
  education_years: {
    id: 'education_years',
    name: 'Education_Years',
    description: '',
    dataType: null,
    standardizedVariable: null,
    term: null,
  },
};

const MOCK_STANDARDIZED_VARIABLES: any = {
  std_age: { id: 'std_age', name: 'Age', variable_type: 'Continuous' },
  std_sex: { id: 'std_sex', name: 'Sex', variable_type: 'Categorical' },
  std_diagnosis: { id: 'std_diagnosis', name: 'Diagnosis', variable_type: 'Categorical' },
  std_assessment: {
    id: 'std_assessment',
    name: 'Assessment Tool',
    variable_type: 'Categorical',
    is_multi_column_measure: true,
  },
};

const MOCK_OPTIONS = [
  { label: 'Age', id: 'std_age', variable_type: 'Continuous', disabled: false },
  { label: 'Sex', id: 'std_sex', variable_type: 'Categorical', disabled: false },
  { label: 'Diagnosis', id: 'std_diagnosis', variable_type: 'Categorical', disabled: false },
  { label: 'Assessment Tool', id: 'std_assessment', variable_type: 'Categorical', disabled: false },
];

function MockColumnAnnotation({ onToggleMock }: { onToggleMock?: () => void }) {
  // -- Local State instead of Store --
  const [columns, setColumns] = useState(MOCK_COLUMNS);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [activeDragEvent, setActiveDragEvent] = useState<DragStartEvent | null>(null);

  const columnsArray = Object.entries(columns);

  // -- DndKit Sensors --
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Require a 5px drag intent to trigger (prevent accidental drags on click)
      },
    })
  );

  // -- Compute Taxonomy Nodes --
  const taxonomyNodes = useMemo(() => {
    // 1. Group 1: Demographics (std_age, std_sex, std_diagnosis)
    const demographicsNode: TaxonomyNode = {
      id: 'demographics',
      label: 'Demographics',
      count: 0,
      children: [],
    };

    ['std_age', 'std_sex', 'std_diagnosis'].forEach((varId) => {
      const varDef = MOCK_STANDARDIZED_VARIABLES[varId];
      if (varDef) {
        const count = columnsArray.filter(
          ([_, col]: any) => col.standardizedVariable === varId
        ).length;
        demographicsNode.children!.push({
          id: varId,
          label: varDef.name,
          count,
        });
        demographicsNode.count += count;
      }
    });

    // 2. Group 2: Dynamic (is_multi_column_measure)
    // For now, let's just do 'std_assessment'
    const assessmentsNode: TaxonomyNode = {
      id: 'std_assessment', // grouping folder id -> var id
      label: MOCK_STANDARDIZED_VARIABLES.std_assessment.name,
      count: 0,
      children: [],
      isMultiColumn: true,
    };

    const assessmentColumns = columnsArray.filter(
      ([_, col]: any) => col.standardizedVariable === 'std_assessment'
    );
    assessmentsNode.count = assessmentColumns.length;

    // Group assessment columns by term
    const groupedByTerm: Record<string, number> = {};
    let unassignedCount = 0;

    assessmentColumns.forEach(([_, col]: any) => {
      if (col.term) {
        groupedByTerm[col.term] = (groupedByTerm[col.term] || 0) + 1;
      } else {
        unassignedCount++;
      }
    });

    // Populate with ALL terms from the assessment vocabulary
    ALL_TERMS.forEach((term) => {
      assessmentsNode.children!.push({
        id: term.id,
        label: term.label,
        count: groupedByTerm[term.id] || 0,
      });
    });

    if (unassignedCount > 0) {
      assessmentsNode.children!.unshift({
        id: 'unassigned_std_assessment',
        label: 'Unassigned',
        count: unassignedCount,
      });
    }

    return [demographicsNode, assessmentsNode];
  }, [columnsArray]);

  // -- Filtered Data & Selection State --
  const filteredColumnsArray = useMemo(() => {
    let result = columnsArray;

    if (selectedNodeId) {
      result = result.filter(([_, column]: [string, any]) => {
        if (selectedNodeId === 'demographics') {
          const demoIds = ['std_age', 'std_sex', 'std_diagnosis'];
          return demoIds.includes(column.standardizedVariable);
        }
        if (selectedNodeId.startsWith('std_')) {
          // e.g. std_age, std_assessment
          return column.standardizedVariable === selectedNodeId;
        }
        if (selectedNodeId.startsWith('unassigned_')) {
          const varId = selectedNodeId.replace('unassigned_', '');
          return column.standardizedVariable === varId && !column.term;
        }
        // Must be a term ID
        return column.term === selectedNodeId;
      });
    }

    if (debouncedSearchQuery) {
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        ([_, column]: [string, any]) =>
          column.name.toLowerCase().includes(lowerQuery) ||
          (column.description || '').toLowerCase().includes(lowerQuery)
      );
    }

    return result;
  }, [columnsArray, selectedNodeId, debouncedSearchQuery]);

  const [selectedColumnIds, setSelectedColumnIds] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  // Clear selection when filter changes to avoid weird state
  useMemo(() => {
    setSelectedColumnIds(new Set());
    setLastSelectedId(null);
  }, [selectedNodeId, debouncedSearchQuery]);

  const handleCardClick = (event: React.MouseEvent, columnId: string) => {
    const isMacCd =
      window.navigator.platform.includes('Mac') || window.navigator.platform.includes('macOS');
    const isMultiSelectModifier = isMacCd ? event.metaKey : event.ctrlKey;

    if (event.shiftKey && lastSelectedId) {
      // Find indices of last selected and currently clicked
      const currentIndex = filteredColumnsArray.findIndex(([id]) => id === columnId);
      const lastIndex = filteredColumnsArray.findIndex(([id]) => id === lastSelectedId);

      if (currentIndex !== -1 && lastIndex !== -1) {
        const start = Math.min(currentIndex, lastIndex);
        const end = Math.max(currentIndex, lastIndex);

        const newSelection = new Set(selectedColumnIds);
        for (let i = start; i <= end; i++) {
          newSelection.add(filteredColumnsArray[i][0]);
        }
        setSelectedColumnIds(newSelection);
        return; // Don't update lastSelectedId on shift-click
      }
    } else if (isMultiSelectModifier) {
      // Toggle single item
      const newSelection = new Set(selectedColumnIds);
      if (newSelection.has(columnId)) {
        newSelection.delete(columnId);
      } else {
        newSelection.add(columnId);
      }
      setSelectedColumnIds(newSelection);
    } else {
      // Single select (or unselect if clicking the only selected item)
      if (selectedColumnIds.size === 1 && selectedColumnIds.has(columnId)) {
        setSelectedColumnIds(new Set());
        setLastSelectedId(null);
        return;
      }
      const newSelection = new Set<string>();
      newSelection.add(columnId);
      setSelectedColumnIds(newSelection);
    }
    setLastSelectedId(columnId);
  };

  // -- Handlers (Mocking Redux Actions) --

  const handleDescriptionChange = (columnId: string, description: string | null) => {
    setColumns((prev: any) => ({
      ...prev,
      [columnId]: { ...prev[columnId], description },
    }));
  };

  const handleStandardizedVariableChange = (columnId: string, newId: string | null) => {
    setColumns((prev: any) => ({
      ...prev,
      [columnId]: { ...prev[columnId], standardizedVariable: newId, term: null },
    }));
  };

  const handleDataTypeChange = (
    columnId: string,
    newDataType: 'Categorical' | 'Continuous' | null
  ) => {
    let dataType: DataType | null = null;
    if (newDataType === 'Categorical') dataType = DataType.categorical;
    else if (newDataType === 'Continuous') dataType = DataType.continuous;

    setColumns((prev: any) => ({
      ...prev,
      [columnId]: { ...prev[columnId], dataType },
    }));
  };

  // -- Bulk Actions --

  const handleClearSelection = () => {
    setSelectedColumnIds(new Set());
    setLastSelectedId(null);
  };

  const handleBulkAssignVariable = (variableId: string | null) => {
    setColumns((prev: any) => {
      const updated = { ...prev };
      selectedColumnIds.forEach((id) => {
        updated[id] = { ...updated[id], standardizedVariable: variableId, term: null };
      });
      return updated;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragEvent(event);
  };

  const handleDragCancel = () => {
    setActiveDragEvent(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragEvent(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !overData) return;

    // SCENARIO 1: Left to Right (Sidebar item to Card)
    if (activeData.type === 'sidebar' && overData.type === 'card') {
      const sidebarId = activeData.id;
      const targetCardId = overData.id;

      // Ignore structural folders
      if (
        sidebarId === 'demographics' ||
        sidebarId === 'all_columns' ||
        sidebarId === 'unassigned_std_assessment'
      )
        return;

      let applyVarId: string | null = null;
      let applyTermId: string | null = null;

      if (MOCK_STANDARDIZED_VARIABLES[sidebarId]) {
        applyVarId = sidebarId;
      } else if (TERM_BY_ID.has(sidebarId)) {
        applyVarId = 'std_assessment';
        applyTermId = sidebarId;
      }

      // If targeted card is part of multi-selection, apply to ALL selected
      const isCardSelected = selectedColumnIds.has(targetCardId);
      const targetsToUpdate =
        isCardSelected && selectedColumnIds.size > 0
          ? Array.from(selectedColumnIds)
          : [targetCardId];

      setColumns((prev: any) => {
        const updated = { ...prev };
        targetsToUpdate.forEach((id) => {
          updated[id] = { ...updated[id], standardizedVariable: applyVarId, term: applyTermId };
        });
        return updated;
      });
    }

    // SCENARIO 2: Right to Left (Card to Sidebar item)
    if (activeData.type === 'card' && overData.type === 'sidebar') {
      const draggedCardId = activeData.id;
      const targetSidebarId = overData.id;

      // Ignore structural folders
      if (
        targetSidebarId === 'demographics' ||
        targetSidebarId === 'all_columns' ||
        targetSidebarId === 'unassigned_std_assessment'
      )
        return;

      let applyVarId: string | null = null;
      let applyTermId: string | null = null;

      if (MOCK_STANDARDIZED_VARIABLES[targetSidebarId]) {
        applyVarId = targetSidebarId;
      } else if (TERM_BY_ID.has(targetSidebarId)) {
        applyVarId = 'std_assessment';
        applyTermId = targetSidebarId;
      }

      // Apply to all dragged cards
      const isCardSelected = selectedColumnIds.has(draggedCardId);
      const targetsToUpdate =
        isCardSelected && selectedColumnIds.size > 0
          ? Array.from(selectedColumnIds)
          : [draggedCardId];

      setColumns((prev: any) => {
        const updated = { ...prev };
        targetsToUpdate.forEach((id) => {
          updated[id] = { ...updated[id], standardizedVariable: applyVarId, term: applyTermId };
        });
        return updated;
      });
    }
  };

  const columnCardData = filteredColumnsArray.map(([columnId, column]: [string, any]) => {
    const selectedStandardizedVariable = column.standardizedVariable
      ? MOCK_STANDARDIZED_VARIABLES[column.standardizedVariable]
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
      term: column.term,
      termLabel: column.term
        ? TERM_BY_ID.get(column.term)?.abbreviation || TERM_BY_ID.get(column.term)?.label
        : null,
      termTooltip: column.term ? TERM_BY_ID.get(column.term)?.label : null,
      standardizedVariableLabel: column.standardizedVariable
        ? MOCK_STANDARDIZED_VARIABLES[column.standardizedVariable]?.name
        : null,
    };
  });

  const renderDragOverlay = () => {
    if (!activeDragEvent || !activeDragEvent.active.data.current) return null;

    const data = activeDragEvent.active.data.current;

    if (data.type === 'sidebar') {
      const actualSidebarId = data.id as string;
      const labelText =
        MOCK_STANDARDIZED_VARIABLES[actualSidebarId]?.name ||
        TERM_BY_ID.get(actualSidebarId)?.label ||
        'Item';
      return (
        <Box
          sx={{
            p: 1,
            px: 2,
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: 8,
            boxShadow: 8,
            opacity: 0.95,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            transform: 'rotate(2deg)',
            cursor: 'grabbing',
          }}
        >
          <DragIndicatorIcon fontSize="small" sx={{ opacity: 0.7 }} />
          <Typography variant="body2" fontWeight="bold">
            {labelText}
          </Typography>
        </Box>
      );
    }

    if (data.type === 'card') {
      const actualCardId = data.id as string;
      const isMulti = selectedColumnIds.has(actualCardId) && selectedColumnIds.size > 1;
      const count = isMulti ? selectedColumnIds.size : 1;
      const cardData = columns[actualCardId];

      return (
        <Box
          sx={{
            p: 1,
            px: 2,
            bgcolor: 'background.paper',
            borderRadius: 8,
            boxShadow: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            border: '1px solid #e0e0e0',
            opacity: 0.95,
            transform: 'rotate(-2deg)',
            cursor: 'grabbing',
            maxWidth: 300,
          }}
        >
          <DragIndicatorIcon fontSize="small" color="disabled" />
          <Typography
            variant="body2"
            fontWeight="bold"
            noWrap
            sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
          >
            {cardData?.name || 'Column'}
          </Typography>
          {isMulti && (
            <Box
              sx={{
                ml: 0.5,
                px: 1,
                py: 0.25,
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 4,
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            >
              +{count - 1} more
            </Box>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={pointerWithin}
    >
      <div
        className="flex flex-col gap-6 h-[70vh] overflow-hidden relative"
        data-cy="column-annotation-container"
      >
        {onToggleMock && (
          <div className="absolute top-0 right-4 z-50">
            <Button variant="outlined" color="primary" onClick={onToggleMock}>
              Switch to multi-column measure
            </Button>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* -- TAXONOMY SIDEBAR -- */}
          <MockTaxonomySidebar
            nodes={taxonomyNodes}
            selectedNodeId={selectedNodeId}
            onNodeSelect={setSelectedNodeId}
          />

          <div className="flex-1 flex flex-col overflow-hidden max-w-6xl mx-auto w-full">
            <div className="px-4 pt-4 shrink-0 flex flex-col gap-3">
              <SearchFilter
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                showingCount={filteredColumnsArray.length}
                totalCount={columnsArray.length}
                hasActiveFilters={searchQuery.length > 0 || selectedNodeId !== null}
                onClearAll={() => {
                  setSearchQuery('');
                  setSelectedNodeId(null);
                }}
              />
              {/* ACTION BAR INLINE */}
              <MockActionBar
                selectedCount={selectedColumnIds.size}
                options={MOCK_OPTIONS}
                onClearSelection={handleClearSelection}
                onAssignVariable={handleBulkAssignVariable}
                onIsCreatingGroupChange={() => {}} // No longer used in paperpile design
              />
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-20 pt-4" data-cy="scrollable-container">
              {/* Global Header Row - Sticky */}
              <Box className="sticky top-0 z-10 mb-4 border border-gray-200 shadow-sm rounded-t-lg backdrop-blur-sm bg-opacity-95 bg-gray-100 grid grid-cols-[1fr_3fr] md:grid-cols-[1fr_4fr] gap-4 px-4 pt-3 pb-1 items-end min-w-[768px]">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Data Type
                </span>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Mapped Variable
                </span>
              </Box>

              <div className="space-y-3">
                {/* Flat rendering flow with paperpile-style chips */}
                {columnCardData.map((columnData) => (
                  <div key={columnData.columnId} className="w-full">
                    <ColumnAnnotationCard
                      id={columnData.columnId}
                      name={columnData.name}
                      description={columnData.description}
                      dataType={columnData.dataType}
                      standardizedVariableId={columnData.standardizedVariableId}
                      standardizedVariableOptions={MOCK_OPTIONS}
                      isDataTypeEditable={columnData.isDataTypeEditable}
                      inferredDataTypeLabel={columnData.inferredDataTypeLabel}
                      term={columnData.term}
                      termLabel={columnData.termLabel}
                      termTooltip={columnData.termTooltip}
                      standardizedVariableLabel={columnData.standardizedVariableLabel}
                      selected={selectedColumnIds.has(columnData.columnId)}
                      onChipClick={setSelectedNodeId}
                      onClick={(e) => handleCardClick(e, columnData.columnId)}
                      onDescriptionChange={handleDescriptionChange}
                      onDataTypeChange={handleDataTypeChange}
                      onStandardizedVariableChange={handleStandardizedVariableChange}
                    />
                  </div>
                ))}

                {filteredColumnsArray.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Typography>No columns match the selected filter.</Typography>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <DragOverlay dropAnimation={null}>{renderDragOverlay()}</DragOverlay>
    </DndContext>
  );
}

export default MockColumnAnnotation;
