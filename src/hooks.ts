import { useState, useEffect, useMemo } from 'react';
import useDataStore from './stores/data';
import { StandardizedVariable } from './utils/internal_types';
import { getAllMappedColumns } from './utils/util';

export const useColumnUpdates = () => {
  const updateColumnDescription = useDataStore((state) => state.updateColumnDescription);
  const updateColumnDataType = useDataStore((state) => state.updateColumnDataType);
  const updateColumnStandardizedVariable = useDataStore(
    (state) => state.updateColumnStandardizedVariable
  );

  const handleDescriptionChange = (columnId: string, newDescription: string | null) => {
    updateColumnDescription(columnId, newDescription);
  };

  const handleDataTypeChange = (
    columnId: string,
    newDataType: 'Categorical' | 'Continuous' | null
  ) => {
    updateColumnDataType(columnId, newDataType);
  };

  const handleStandardizedVariableChange = (
    columnId: string,
    newStandardizedVariable: StandardizedVariable | null
  ) => {
    updateColumnStandardizedVariable(columnId, newStandardizedVariable);
  };

  return {
    handleDescriptionChange,
    handleDataTypeChange,
    handleStandardizedVariableChange,
  };
};

export const useTablePagination = (initialRowsPerPage: number) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    page,
    setPage,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
  };
};

export const usePagination = <T>(items: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePaginationChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    currentItems,
    totalPages,
    handlePaginationChange,
  };
};
export function useMultiColumnMeasuresState() {
  const initializeMultiColumnMeasuresState = useDataStore(
    (state) => state.initializeMultiColumnMeasuresState
  );
  const {
    addTermCard,
    updateTermInCard,
    addColumnToCard,
    removeColumnFromCard,
    removeTermCard,
    getMultiColumnMeasuresState,
    getAvailableTermsForVariable,
    getColumnOptionsForVariable,
  } = useDataStore();

  return {
    initializeMultiColumnMeasuresState,
    addTermCard,
    updateTermInCard,
    addColumnToCard,
    removeColumnFromCard,
    removeTermCard,
    getMultiColumnMeasuresState,
    getAvailableTermsForVariable,
    getColumnOptionsForVariable,
  };
}

export function useMultiColumnMeasuresData() {
  const [loading, setLoading] = useState(true);

  const columns = useDataStore((state) => state.columns);
  const getStandardizedVariableColumns = useDataStore(
    (state) => state.getStandardizedVariableColumns
  );
  const initializeMultiColumnMeasuresState = useDataStore(
    (state) => state.initializeMultiColumnMeasuresState
  );
  const getMappedMultiColumnMeasureStandardizedVariables = useDataStore(
    (state) => state.getMappedMultiColumnMeasureStandardizedVariables
  );

  const multiColumnVariables = getMappedMultiColumnMeasureStandardizedVariables();

  useEffect(() => {
    if (multiColumnVariables.length === 0) {
      setLoading(false);
      return;
    }

    multiColumnVariables.forEach((variable) => {
      initializeMultiColumnMeasuresState(variable.identifier);
    });

    setLoading(false);
  }, [multiColumnVariables, initializeMultiColumnMeasuresState]);

  return {
    loading,
    multiColumnVariables,
    columns,
    getStandardizedVariableColumns,
  };
}

export function useActiveVariableData(
  multiColumnVariables: StandardizedVariable[],
  activeTab: number
) {
  const getStandardizedVariableColumns = useDataStore(
    (state) => state.getStandardizedVariableColumns
  );

  // Memoize to prevent recalculation when array reference changes
  const activeVariableTab = useMemo(
    () => multiColumnVariables[activeTab] || null,
    [multiColumnVariables, activeTab]
  );

  // Memoize to prevent recalculation when store state changes
  const multiColumnMeasuresStates = useDataStore((state) => state.multiColumnMeasuresStates);
  const currentState = useMemo(
    () => (activeVariableTab ? multiColumnMeasuresStates[activeVariableTab.identifier] : null),
    [activeVariableTab, multiColumnMeasuresStates]
  );

  // Memoize to prevent expensive function call
  const currentVariableColumns = useMemo(
    () => (activeVariableTab ? getStandardizedVariableColumns(activeVariableTab) : []),
    [activeVariableTab, getStandardizedVariableColumns]
  );

  const currentTermCards = currentState?.termCards || [];
  const variableAllMappedColumns = getAllMappedColumns(currentTermCards);

  return {
    activeVariableTab,
    currentState,
    currentVariableColumns,
    currentTermCards,
    variableAllMappedColumns,
  };
}
