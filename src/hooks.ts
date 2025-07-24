import { useState, useEffect } from 'react';
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
  const addTermCard = useDataStore((state) => state.addTermCard);
  const updateTermInCard = useDataStore((state) => state.updateTermInCard);
  const addColumnToCard = useDataStore((state) => state.addColumnToCard);
  const removeColumnFromCard = useDataStore((state) => state.removeColumnFromCard);
  const removeTermCard = useDataStore((state) => state.removeTermCard);
  const getMultiColumnMeasuresState = useDataStore((state) => state.getMultiColumnMeasuresState);
  const columnOptionsForVariables = useDataStore((state) => state.columnOptionsForVariables);
  const availableTermsForVariables = useDataStore((state) => state.availableTermsForVariables);

  return {
    initializeMultiColumnMeasuresState,
    addTermCard,
    updateTermInCard,
    addColumnToCard,
    removeColumnFromCard,
    removeTermCard,
    getMultiColumnMeasuresState,
    columnOptionsForVariables,
    availableTermsForVariables,
  };
}

export function useMultiColumnMeasuresData() {
  const [loading, setLoading] = useState(true);

  const columns = useDataStore((state) => state.columns);
  const multiColumnVariables = useDataStore(
    (state) => state.mappedMultiColumnMeasureStandardizedVariables
  );
  const initializeMultiColumnMeasuresState = useDataStore(
    (state) => state.initializeMultiColumnMeasuresState
  );

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
  };
}

export function useActiveVariableData(
  multiColumnVariables: StandardizedVariable[],
  activeTab: number
) {
  const columns = useDataStore((state) => state.columns);
  const multiColumnMeasuresStates = useDataStore((state) => state.multiColumnMeasuresStates);

  const activeVariableTab = multiColumnVariables[activeTab] || null;
  const currentState = activeVariableTab
    ? multiColumnMeasuresStates[activeVariableTab.identifier]
    : null;

  const currentVariableColumns = activeVariableTab
    ? Object.entries(columns)
        .filter(
          ([_, column]) => column.standardizedVariable?.identifier === activeVariableTab.identifier
        )
        .map(([id, column]) => ({ id, header: column.header }))
    : [];

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
