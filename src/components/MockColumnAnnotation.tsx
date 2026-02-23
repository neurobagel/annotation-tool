import { Box, Typography, Autocomplete, TextField, Button, IconButton, Tooltip } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { ColumnAnnotationInstructions } from '../utils/instructions';
import { DataType } from '../utils/internal_types';
import ColumnAnnotationCard from './ColumnAnnotationCard';
import Instruction from './Instruction';
import MockTaxonomySidebar, { TaxonomyNode } from './MockTaxonomySidebar';
import MockActionBar from './MockActionBar';
import SearchFilter from './SearchFilter';
import assessmentData from '../assets/default_config/assessment.json';

const ALL_TERMS = assessmentData.flatMap((vocab) =>
  vocab.terms.map((term) => ({
    id: term.id,
    label: term.name,
    abbreviation: term.name.split(' ').map((w) => w[0]).join('').toUpperCase().substring(0, 4),
  }))
);

const FORMATTED_TERMS = ALL_TERMS.map((t) => ({
  label: `${t.abbreviation} - ${t.label}`,
  id: t.id,
}));

const TERM_BY_ID = new Map(ALL_TERMS.map(t => [t.id, t]));

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

function MockColumnAnnotation() {
  // -- Local State instead of Store --
  const [columns, setColumns] = useState(MOCK_COLUMNS);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const columnsArray = Object.entries(columns);

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
        const count = columnsArray.filter(([_, col]: any) => col.standardizedVariable === varId).length;
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

    Object.entries(groupedByTerm).forEach(([termId, count]) => {
      const termDef = TERM_BY_ID.get(termId);
      if (termDef) {
        assessmentsNode.children!.push({
          id: termId,
          label: termDef.abbreviation || termDef.label,
          count,
        });
      }
    });

    if (unassignedCount > 0) {
      assessmentsNode.children!.push({
        id: 'unassigned_std_assessment',
        label: 'Unassigned',
        count: unassignedCount,
      });
    }

    // Include an "All Columns" node
    const allColumnsNode: TaxonomyNode = {
      id: 'all_columns',
      label: 'All Columns',
      count: columnsArray.length,
    };

    return [allColumnsNode, demographicsNode, assessmentsNode];
  }, [columnsArray]);

  // -- Filtered Data & Selection State --
  const filteredColumnsArray = useMemo(() => {
    let result = columnsArray;

    if (selectedNodeId && selectedNodeId !== 'all_columns') {
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
      result = result.filter(([_, column]: [string, any]) => {
        return (
          column.name.toLowerCase().includes(lowerQuery) ||
          (column.description || '').toLowerCase().includes(lowerQuery)
        );
      });
    }

    return result;
  }, [columnsArray, selectedNodeId, debouncedSearchQuery]);

  const [selectedColumnIds, setSelectedColumnIds] = useState<Set<string>>(new Set());
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
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
    // Optional: handleClearSelection();
  };

  const handleBulkAssignTerm = (termId: string | null) => {
    setColumns((prev: any) => {
      const updated = { ...prev };
      selectedColumnIds.forEach((id) => {
        // Only assign term if it's already an assessment, or maybe auto-assign assessment?
        // Let's assume they have to map to assessment first, but we can do it automatically for convenience
        updated[id] = { ...updated[id], term: termId, standardizedVariable: 'std_assessment' };
      });
      return updated;
    });
    handleClearSelection();
  };

  const handleRemoveFromGroup = (columnId: string) => {
    setColumns((prev: any) => ({
      ...prev,
      [columnId]: { ...prev[columnId], term: null },
    }));
    setSelectedColumnIds((prev) => {
      const updated = new Set(prev);
      updated.delete(columnId);
      return updated;
    });
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
      termLabel: column.term ? TERM_BY_ID.get(column.term)?.abbreviation || TERM_BY_ID.get(column.term)?.label : null,
    };
  });

  return (
    <div
      className="flex flex-col gap-6 h-[70vh] overflow-hidden relative"
      data-cy="column-annotation-container"
    >
      <div className="p-4 flex-shrink-0">
        <Instruction title="Column Annotation (Mock)" className="mb-0">
          <ColumnAnnotationInstructions />
        </Instruction>
      </div>

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
            />
            {/* ACTION BAR INLINE */}
            <MockActionBar
              selectedCount={selectedColumnIds.size}
              options={MOCK_OPTIONS}
              onClearSelection={handleClearSelection}
              onAssignVariable={handleBulkAssignVariable}
              onIsCreatingGroupChange={setIsCreatingGroup}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-20 pt-4" data-cy="scrollable-container">
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
              {isCreatingGroup && selectedColumnIds.size > 0 ? (
                <>
                  {/* Selected cards wrapped in a group container */}
                  <div className="border-[3px] border-gray-900 rounded-lg p-4 bg-white shadow-sm relative mb-6">
                    {/* Header of the container with Label and Dropdown */}
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                      <Typography variant="h6" className="font-bold text-gray-900">
                        New Group
                      </Typography>
                      <div className="flex items-center gap-2">
                        <Typography variant="body2" className="text-gray-600 font-medium">
                          Map to Tool:
                        </Typography>
                        <Autocomplete
                          options={FORMATTED_TERMS}
                          getOptionLabel={(option) => option.label}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(_, value) => {
                            if (value) {
                              handleBulkAssignTerm(value.id);
                              setIsCreatingGroup(false);
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search for tool..."
                              size="small"
                              className="w-64 bg-gray-50"
                              variant="outlined"
                              autoFocus
                            />
                          )}
                          size="small"
                        />
                      </div>
                      <div className="flex-1" />
                      <Button
                        size="small"
                        color="inherit"
                        onClick={() => setIsCreatingGroup(false)}
                        className="text-gray-500"
                        startIcon={<CancelIcon fontSize="small" />}
                      >
                        Cancel
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {columnCardData
                        .filter((c) => selectedColumnIds.has(c.columnId))
                        .map((columnData) => (
                          <div key={columnData.columnId} className="w-full flex items-center gap-3">
                            <div className="flex-1 min-w-0">
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
                                selected={true}
                                onClick={(e) => handleCardClick(e, columnData.columnId)}
                                onDescriptionChange={handleDescriptionChange}
                                onDataTypeChange={handleDataTypeChange}
                                onStandardizedVariableChange={handleStandardizedVariableChange}
                              />
                            </div>
                            <Tooltip title="Remove from selection">
                              <IconButton
                                onClick={() => {
                                  setSelectedColumnIds((prev) => {
                                    const updated = new Set(prev);
                                    updated.delete(columnData.columnId);
                                    return updated;
                                  });
                                }}
                                color="error"
                                className="flex-shrink-0"
                              >
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Unselected cards outside the container */}
                  {columnCardData
                    .filter((c) => !selectedColumnIds.has(c.columnId))
                    .map((columnData) => (
                      <div key={columnData.columnId} className="w-full opacity-50 pointer-events-none transition-opacity">
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
                          selected={false}
                          onClick={(e) => handleCardClick(e, columnData.columnId)}
                          onDescriptionChange={handleDescriptionChange}
                          onDataTypeChange={handleDataTypeChange}
                          onStandardizedVariableChange={handleStandardizedVariableChange}
                        />
                      </div>
                    ))}
                </>
              ) : (
                /* Normal rendering flow with persistent groups for assigned terms */
                (() => {
                  const groupedByTerm = new Map<string, typeof columnCardData>();
                  const ungrouped: typeof columnCardData = [];

                  columnCardData.forEach(c => {
                    if (c.term) {
                      if (!groupedByTerm.has(c.term)) groupedByTerm.set(c.term, []);
                      groupedByTerm.get(c.term)!.push(c);
                    } else {
                      ungrouped.push(c);
                    }
                  });

                  return (
                    <>
                      {/* Render grouped columns in containers */}
                      {Array.from(groupedByTerm.entries()).map(([termId, cols]) => (
                        <div key={termId} className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50/50 shadow-sm relative mb-6">
                          <div className="flex items-center gap-4 mb-4 pb-3 border-b border-gray-200">
                            <Typography variant="h6" className="font-bold text-gray-800">
                              {cols[0].termLabel || termId}
                            </Typography>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                              {cols.length} column{cols.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {cols.map((columnData) => (
                              <div key={columnData.columnId} className="w-full flex items-center gap-3">
                                <div className="flex-1 min-w-0">
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
                                    selected={selectedColumnIds.has(columnData.columnId)}
                                    onClick={(e) => handleCardClick(e, columnData.columnId)}
                                    onDescriptionChange={handleDescriptionChange}
                                    onDataTypeChange={handleDataTypeChange}
                                    onStandardizedVariableChange={handleStandardizedVariableChange}
                                  />
                                </div>
                                <Tooltip title="Remove from group">
                                  <IconButton
                                    onClick={() => handleRemoveFromGroup(columnData.columnId)}
                                    color="error"
                                    className="flex-shrink-0"
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Render ungrouped columns normally */}
                      {ungrouped.map((columnData) => (
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
                            selected={selectedColumnIds.has(columnData.columnId)}
                            onClick={(e) => handleCardClick(e, columnData.columnId)}
                            onDescriptionChange={handleDescriptionChange}
                            onDataTypeChange={handleDataTypeChange}
                            onStandardizedVariableChange={handleStandardizedVariableChange}
                          />
                        </div>
                      ))}
                    </>
                  );
                })()
              )}

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
  );
}

export default MockColumnAnnotation;
