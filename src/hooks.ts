import Ajv from 'ajv';
import naturalCompare from 'natural-compare-lite';
import { useState, useEffect, useMemo } from 'react';
import schema from './assets/neurobagel_data_dictionary.schema.json';
import useDataStore from './stores/data';
import { StandardizedVariable, DataDictionary } from './utils/internal_types';
import { getAllMappedColumns, getDataDictionary } from './utils/util';

export const useColumnUpdates = () => {
  const updateColumnDescription = useDataStore((state) => state.updateColumnDescription);
  const updateColumnVariableType = useDataStore((state) => state.updateColumnVariableType);
  const updateColumnStandardizedVariable = useDataStore(
    (state) => state.updateColumnStandardizedVariable
  );

  const handleDescriptionChange = (columnId: string, newDescription: string | null) => {
    updateColumnDescription(columnId, newDescription);
  };

  const handleVariableTypeChange = (
    columnId: string,
    newVariableType: 'Categorical' | 'Continuous' | null
  ) => {
    updateColumnVariableType(columnId, newVariableType);
  };

  const handleStandardizedVariableChange = (
    columnId: string,
    newStandardizedVariable: StandardizedVariable | null
  ) => {
    updateColumnStandardizedVariable(columnId, newStandardizedVariable);
  };

  return {
    handleDescriptionChange,
    handleVariableTypeChange,
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
  const columns = useDataStore((state) => state.columns);
  const config = useDataStore((state) => state.config);

  const multiColumnVariables = Object.values(config).filter(
    (variable) =>
      variable.variable_type === 'Collection' &&
      Object.entries(columns).some(
        ([_, column]) => column.standardizedVariable?.identifier === variable.identifier
      )
  );

  const initializeMultiColumnMeasuresState = useDataStore(
    (state) => state.initializeMultiColumnMeasuresState
  );

  useEffect(() => {
    // TODO remove this together with all state handling for Term cards in the store
    // Things like "is this a multi-column variable" should be derived from the state directly
    // via a getter and not have to be initialized and stored separately with these side effect functions.
    multiColumnVariables.forEach((variable) => {
      initializeMultiColumnMeasuresState(variable.identifier);
    });
  }, [multiColumnVariables, initializeMultiColumnMeasuresState]);

  return {
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

export function useDataDictionary(): DataDictionary {
  const columns = useDataStore((state) => state.columns);
  return useMemo(() => getDataDictionary(columns), [columns]);
}

export function useSchemaValidation(dataDictionary: DataDictionary) {
  return useMemo(() => {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);
    const isValid = validate(dataDictionary);

    if (!isValid) {
      /*
      Since Ajv uses JSON Pointer format for instance path
      we need to slice the leading slash off of the instance path
      */
      const errors =
        validate.errors?.map((error) => {
          const pathSegments = error.instancePath.slice(1).split('/');
          return pathSegments[0];
        }) || [];

      const uniqueErrors = Array.from(new Set(errors));

      return { schemaValid: false, schemaErrors: uniqueErrors };
    }

    return { schemaValid: true, schemaErrors: [] };
  }, [dataDictionary]);
}

export function useSortedFilteredValues(
  uniqueValues: string[],
  missingValues: string[],
  sortDir: 'asc' | 'desc',
  filterMissing: boolean
) {
  const sortedValues = useMemo(
    () =>
      [...uniqueValues].sort((a, b) =>
        sortDir === 'asc' ? naturalCompare(a, b) : naturalCompare(b, a)
      ),
    [uniqueValues, sortDir]
  );

  const visibleValues = useMemo(
    () => (filterMissing ? sortedValues.filter((v) => missingValues.includes(v)) : sortedValues),
    [sortedValues, filterMissing, missingValues]
  );

  return { sortedValues, visibleValues };
}
