type DataStore = {
  // remove and use columns for preview instead and we need a hook to compute the preview from columns
  dataTable: DataTable;
  columns: Columns;
  uploadedDataTableFileName: string | null;
  isConfigLoading: boolean;
  // remove
  setDataTable: (data: DataTable) => void;
  // rework to just set columns
  initializeColumns: (data: Columns) => void;
  setUploadedDataTableFileName: (fileName: string | null) => void;
  // move out
  processDataTableFile: (file: File) => Promise<void>;
  // turns into standardized variables configs which right now is stored in configs
  standardizedVariables: StandardizedVariableCollection;
  // remove
  updateStandardizedVariables: () => void;
  // move logic into hook
  mappedStandardizedVariables: StandardizedVariable[];
  // remove
  updateMappedStandardizedVariables: () => void;
  // move logic into hook
  mappedMultiColumnMeasureStandardizedVariables: StandardizedVariable[];
  // remove
  updateMappedMultiColumnMeasureStandardizedVariables: () => void;
  // move logic into hook
  mappedSingleColumnStandardizedVariables: StandardizedVariable[];
  // remove
  updateMappedSingleColumnStandardizedVariables: () => void;
  // move logic into hook
  multiColumnMeasureVariableIdentifiers: Set<string>;
  // remove
  updateMultiColumnMeasureVariableIdentifiers: () => void;
  // move logic into hook
  singleColumnVariableIdentifiers: Set<string>;
  // remove
  updateSingleColumnVariableIdentifiers: () => void;
  // move logic into hook
  getStandardizedVariableColumns: (
    StandardizedVariable: StandardizedVariable
  ) => { id: string; header: string }[];
  // rename to be clearer i.e., set the column description
  updateColumnDescription: (columnID: string, description: string | null) => void;
  // rename to be clearer as a setter
  updateColumnVariableType: (columnID: string, variableType: VariableType) => void;
  // rename to be clearer as a setter
  updateColumnStandardizedVariable: (
    columnID: string,
    standardizedVariable: StandardizedVariable | null
  ) => void;
  // rename to be clearer as a setter
  updateColumnIsPartOf: (
    columnID: string,
    term: { identifier: string; label: string } | null
  ) => void;
  // rename to be clearer as a setter
  updateColumnLevelDescription: (columnID: string, value: string, description: string) => void;
  // rename to be clearer as a setter
  updateColumnLevelTerm: (
    columnID: string,
    value: string,
    term: { identifier: string; label: string } | null
  ) => void;
  // rename to be clearer as a setter
  updateColumnUnits: (columnID: string, unitsDescription: string | null) => void;
  // rename to be clearer as a setter
  updateColumnMissingValues: (columnID: string, value: string, isMissing: boolean) => void;
  // rename to be clearer as a setter
  updateColumnFormat: (columnID: string, format: { termURL: string; label: string } | null) => void;

  // keep for preview
  uploadedDataDictionary: DataDictionary;
  uploadedDataDictionaryFileName: string | null;
  setDataDictionary: (data: DataDictionary) => void;
  setUploadedDataDictionaryFileName: (fileName: string | null) => void;
  // move logic out
  processDataDictionaryFile: (file: File) => Promise<void>;

  // convert to string, points to the name of the selected config
  config: Config;
  configOptions: string[];
  // refactor to be just a setter called inside hte component
  loadConfigOptions: () => Promise<void>;
  // remove and use config instead
  selectedConfig: string | null;
  // rename setConfig
  setSelectedConfig: (configName: string | null) => void;
  // refactor
  loadConfig: (configName: string) => Promise<void>;
  // move logic into hook
  hasMultiColumnMeasures: () => boolean;
  // move logic into hook
  termOptions: Record<string, StandardizedTerm[]>;
  // remove
  updateTermOptions: () => void;
  // move logic into hook
  formatOptions: Record<string, TermFormat[]>;
  // remove
  updateFormatOptions: () => void;
  // move logic into hook
  isMultiColumnMeasureStandardizedVariable: (
    standardizedVariable: StandardizedVariable | null | undefined
  ) => boolean;

  // Multi-column measures state management
  // move to component state
  multiColumnMeasuresStates: Record<
    string,
    { terms: StandardizedTerm[]; termCards: MultiColumnMeasuresTermCard[] }
  >;
  // move logic into a hook
  columnOptionsForVariables: Record<string, { id: string; label: string; disabled: boolean }[]>;
  // remove
  updateColumnOptionsForVariable: (variableId: string) => void;
  // remove
  updateAllColumnOptionsForVariables: () => void;
  // move logic into a hook
  availableTermsForVariables: Record<
    string,
    Record<string, (StandardizedTerm & { disabled: boolean })[]>
  >;
  // Move all this into a hook
  // remove
  updateAvailableTermsForVariable: (variableId: string) => void;
  // remove
  initializeMultiColumnMeasuresState: (variableId: string) => void;
  // remove
  addTermCard: (variableId: string) => void;
  // remove
  updateTermInCard: (variableId: string, cardId: string, term: StandardizedTerm | null) => void;
  // remove
  addColumnToCard: (variableId: string, cardId: string, columnId: string) => void;
  // remove
  removeColumnFromCard: (variableId: string, cardId: string, columnId: string) => void;
  // remove
  removeTermCard: (variableId: string, cardId: string) => void;
  // remove
  getMultiColumnMeasuresState: (
    variableId: string
  ) => { terms: StandardizedTerm[]; termCards: MultiColumnMeasuresTermCard[] } | null;

  reset: () => void;
};
