import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Button } from '@mui/material';
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
  useColumns,
  useDataActions,
  useStandardizedVariables,
  useStandardizedTerms,
} from '~/stores/data';
import useSessionStore from '~/stores/session';
import { useColumnCardData } from '../hooks/useColumnCardData';
import { useMappingMetrics } from '../hooks/useMappingMetrics';
import { useMultiSelect } from '../hooks/useMultiSelect';
import { useSearchFilter } from '../hooks/useSearchFilter';
import { useStandardizedVariableOptions } from '../hooks/useStandardizedVariableOptions';
import { VariableType } from '../utils/internal_types';
import BulkActionBar from './BulkActionBar';
import ColumnAnnotationCard from './ColumnAnnotationCard';
import ColumnAnnotationTour from './ColumnAnnotationTour';
import SearchFilter from './SearchFilter';
import StandardizedVariablesList from './StandardizedVariablesList';
import VirtualColumnList from './VirtualColumnList';

function ColumnAnnotation() {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();
  const standardizedTerms = useStandardizedTerms();
  const {
    userUpdatesColumnDescription,
    userUpdatesMultipleColumnDataTypes,
    userUpdatesMultipleColumnStandardizedVariables,
    userUpdatesMultipleColumnToCollectionMappings,
  } = useDataActions();
  const standardizedVariableOptions = useStandardizedVariableOptions();
  const { searchTerm, debouncedSearchTerm, setSearchTerm, clearSearch } = useSearchFilter(300);
  const { annotatedColumnsCount, totalColumnsCount, mappedVariableCounts, mappedTermCounts } =
    useMappingMetrics();

  const { setHasSeenColumnAnnotationTour } = useSessionStore();

  const columnCardData = useColumnCardData(columns, standardizedVariables, standardizedTerms);

  const [hideAnnotated, setHideAnnotated] = useState(false);

  // Find the first collection variable to highlight its specific section in the tour
  const firstCollectionVarId = useMemo(() => {
    const collectionVars = standardizedVariableOptions.filter(
      (opt) => opt.variable_type === VariableType.collection
    );
    return collectionVars.length > 0 ? collectionVars[0].id : null;
  }, [standardizedVariableOptions]);

  // Memoize the filtering logic to ensure that we only apply the .filter() operation
  // when the actual data changes OR when the 300ms debounce timer finishes, preventing
  // sluggish filtering on every keystroke
  const filteredColumnCardData = useMemo(() => {
    const lowerSearchTerm = debouncedSearchTerm.toLowerCase();

    return columnCardData.filter((col) => {
      if (lowerSearchTerm && !col.name.toLowerCase().includes(lowerSearchTerm)) {
        return false;
      }

      if (hideAnnotated) {
        // A column is considered "annotated" if it has either a standardized variable
        // mapped to it directly, or if it's part of a collection mapping (has a termLabel)
        const isAnnotated = col.standardizedVariableId !== null || col.termLabel !== null;
        if (isAnnotated) return false;
      }

      return true;
    });
  }, [columnCardData, debouncedSearchTerm, hideAnnotated]);

  const visibleColumnIds = useMemo(
    () => filteredColumnCardData.map((col) => col.columnId),
    [filteredColumnCardData]
  );

  const { selectedIds, handleSelect, clearSelection, isSelected } =
    useMultiSelect(visibleColumnIds);

  const selectedIdsRef = useRef(selectedIds);
  useEffect(() => {
    selectedIdsRef.current = selectedIds;
  }, [selectedIds]);

  const handleStandardizedVariablesListItemSelect = useCallback(
    (itemId: string | null) => {
      const currentSelectedIds = selectedIdsRef.current;
      if (itemId && currentSelectedIds.size > 0) {
        const stdVar = standardizedVariables[itemId];
        if (stdVar && stdVar.variable_type !== VariableType.collection) {
          userUpdatesMultipleColumnStandardizedVariables(Array.from(currentSelectedIds), itemId);
          clearSelection();
        } else {
          userUpdatesMultipleColumnToCollectionMappings(Array.from(currentSelectedIds), itemId);
        }
      }
    },
    [
      standardizedVariables,
      userUpdatesMultipleColumnStandardizedVariables,
      userUpdatesMultipleColumnToCollectionMappings,
      clearSelection,
    ]
  );

  const hasMappedSelected = Array.from(selectedIds).some((colId) => {
    const col = columns[colId];
    if (!col) return false;
    return col.standardizedVariable != null || col.isPartOf != null;
  });

  const handleClearMappings = useCallback(() => {
    const selectedArray = Array.from(selectedIdsRef.current);
    userUpdatesMultipleColumnStandardizedVariables(selectedArray, null);
    userUpdatesMultipleColumnToCollectionMappings(selectedArray, null);
    clearSelection();
  }, [
    userUpdatesMultipleColumnStandardizedVariables,
    userUpdatesMultipleColumnToCollectionMappings,
    clearSelection,
  ]);

  const handleCardSelect = useCallback(
    (id: string, e: React.MouseEvent<HTMLDivElement>) => {
      handleSelect(id, e.shiftKey, e.ctrlKey || e.metaKey);
    },
    [handleSelect]
  );

  const handleCardToggleCheckbox = useCallback(
    (id: string) => {
      handleSelect(id, false, true);
    },
    [handleSelect]
  );

  const handleClearDataType = useCallback(
    (id: string) => {
      userUpdatesMultipleColumnDataTypes([id], null);
    },
    [userUpdatesMultipleColumnDataTypes]
  );

  const handleClearMapping = useCallback(
    (id: string) => {
      userUpdatesMultipleColumnStandardizedVariables([id], null);
    },
    [userUpdatesMultipleColumnStandardizedVariables]
  );

  return (
    <div
      role="presentation"
      className="flex justify-center w-full h-[80vh] overflow-hidden"
      data-cy="column-annotation-container"
      data-tour="tour-page-container"
    >
      <ColumnAnnotationTour firstCollectionVarId={firstCollectionVarId} />
      <div className="flex w-full h-full gap-8 px-8">
        {/* Main Column Listing - Left Side */}
        <div className="flex-1 flex flex-col min-w-0 py-4">
          <div className="flex-shrink-0 flex flex-col items-start gap-4 mb-4">
            <Button
              variant="outlined"
              startIcon={<InfoOutlinedIcon />}
              onClick={() => setHasSeenColumnAnnotationTour(false)}
              className="mb-0"
              data-cy="tour-start-button"
            >
              How to use this page
            </Button>
            <div className="w-full flex flex-col xl:flex-row items-stretch xl:items-center gap-4 pb-4">
              <div
                className="w-full xl:w-1/4 max-w-md flex-shrink-0"
                data-tour="tour-search-filter"
              >
                <SearchFilter
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  onClear={clearSearch}
                  placeholder="Filter columns by name..."
                  totalCount={columnCardData.length}
                  filteredCount={filteredColumnCardData.length}
                />
              </div>
              <div data-tour="tour-bulk-action-bar" className="flex-1 min-w-0">
                <BulkActionBar
                  selectedCount={selectedIds.size}
                  onClearSelection={clearSelection}
                  onAssignDataType={(dataType) =>
                    userUpdatesMultipleColumnDataTypes(Array.from(selectedIds), dataType)
                  }
                  hasMappedSelected={hasMappedSelected}
                  onClearMappings={handleClearMappings}
                  hideAnnotated={hideAnnotated}
                  onHideAnnotatedChange={setHideAnnotated}
                />
              </div>
            </div>
          </div>

          <div
            className="flex-1 overflow-hidden flex flex-col pb-4 px-2 -mx-2 w-full"
            data-tour="tour-column-list"
          >
            {/* Global Header Row - Static since virtual list handles scrolling */}
            <Box className="flex-none mb-4 border border-gray-200 shadow-sm rounded-t-lg bg-gray-100 grid grid-cols-[6fr_1fr_3fr] gap-4 px-4 pt-3 pb-1 items-end min-w-[768px]">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Description
              </span>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Data Type
              </span>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Standardized Variable
              </span>
            </Box>

            <div className="flex-1 min-h-0 relative">
              {filteredColumnCardData.length > 0 ? (
                <VirtualColumnList
                  key={`${debouncedSearchTerm}-${hideAnnotated}`}
                  itemCount={filteredColumnCardData.length}
                >
                  {({ index }) => {
                    const columnData = filteredColumnCardData[index];
                    return (
                      <ColumnAnnotationCard
                        key={columnData.columnId}
                        id={columnData.columnId}
                        name={columnData.name}
                        description={columnData.description}
                        dataType={columnData.dataType}
                        standardizedVariableId={columnData.standardizedVariableId}
                        termLabel={columnData.termLabel}
                        termAbbreviation={columnData.termAbbreviation}
                        standardizedVariableOptions={standardizedVariableOptions}
                        inferredDataTypeLabel={columnData.inferredDataTypeLabel}
                        onDescriptionChange={userUpdatesColumnDescription}
                        onClearDataType={handleClearDataType}
                        onClearMapping={handleClearMapping}
                        selected={isSelected(columnData.columnId)}
                        onSelect={handleCardSelect}
                        onToggleCheckbox={handleCardToggleCheckbox}
                      />
                    );
                  }}
                </VirtualColumnList>
              ) : (
                <div className="text-center py-8 text-gray-500" data-cy="no-columns-found-message">
                  No columns found matching &quot;{debouncedSearchTerm}&quot;
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Standardized Variables List */}
        <div className="py-4 h-full" data-tour="tour-standardized-variables-list">
          <StandardizedVariablesList
            onItemSelect={handleStandardizedVariablesListItemSelect}
            hasMultipleSelection={selectedIds.size > 1}
            annotatedColumnsCount={annotatedColumnsCount}
            totalColumnsCount={totalColumnsCount}
            mappedVariableCounts={mappedVariableCounts}
            mappedTermCounts={mappedTermCounts}
          />
        </div>
      </div>
    </div>
  );
}

export default ColumnAnnotation;
