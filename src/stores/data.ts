import { produce } from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  DataTable,
  Columns,
  DataDictionary,
  StandardizedVariableCollection,
  StandardizedVariable,
  VariableType,
  Config,
  StandardizedTerm,
  TermFormat,
  MultiColumnMeasuresTermCard,
} from '../utils/internal_types';
import {
  parseTsvContent,
  fetchAvailableConfigs,
  fetchConfig,
  mapConfigFileToStoreConfig,
} from '../utils/util';

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

const initialState = {
  dataTable: {},
  columns: {},
  uploadedDataTableFileName: null,
  isConfigLoading: true,
  uploadedDataDictionary: {},
  uploadedDataDictionaryFileName: null,
  configOptions: [],
  config: {},
  selectedConfig: null,
  standardizedVariables: {},
  mappedStandardizedVariables: [],
  mappedMultiColumnMeasureStandardizedVariables: [],
  mappedSingleColumnStandardizedVariables: [],
  multiColumnMeasureVariableIdentifiers: new Set<string>(),
  singleColumnVariableIdentifiers: new Set<string>(),
  termOptions: {},
  formatOptions: {},
  multiColumnMeasuresStates: {},
  columnOptionsForVariables: {},
  availableTermsForVariables: {},
};

const useDataStore = create<DataStore>()(
  // TODO: add devtools on the export, not here
  devtools((set, get) => ({
    // Data table
    ...initialState,
    // TODO: remove - this seems unused
    setDataTable: (data: DataTable) => set({ dataTable: data }),
    setUploadedDataTableFileName: (fileName: string | null) =>
      set({ uploadedDataTableFileName: fileName }),
    initializeColumns: (data: Columns) => set({ columns: data }),
    processDataTableFile: async (file: File) =>
      new Promise<void>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          const content = e.target?.result as string;

          const { headers, data } = parseTsvContent(content);

          // Transform data into column-based structure
          const columnData: DataTable = {};
          headers.forEach((_, columnIndex) => {
            const key = (columnIndex + 1).toString();
            columnData[key] = data.map((row) => row[columnIndex]);
          });

          const columns: Columns = headers.reduce((acc, header, index) => {
            const key = (index + 1).toString();
            return {
              ...acc,
              [key]: { header },
            };
          }, {} as Columns);

          set({
            dataTable: columnData,
            columns,
            uploadedDataTableFileName: file.name,
          });

          resolve();
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsText(file);
      }),

    // Column updates
    updateStandardizedVariables: () => {
      const standardizedVariableConfigs = get().config;
      const standardizedVariables = Object.fromEntries(
        Object.entries(standardizedVariableConfigs).map(([standardizedVariableName, config]) => [
          standardizedVariableName,
          { identifier: config.identifier, label: config.label },
        ])
      );
      set({ standardizedVariables });
    },

    updateMappedStandardizedVariables: () => {
      const { config, columns } = get();
      const seenIdentifiers = new Set<string>();
      const uniqueVariables: StandardizedVariable[] = [];

      Object.values(columns).forEach((column) => {
        const variable = column.standardizedVariable;
        if (variable && !seenIdentifiers.has(variable.identifier)) {
          const configEntry = Object.values(config).find(
            (configItem) => configItem.identifier === variable.identifier
          );

          if (configEntry?.variable_type !== 'Identifier') {
            seenIdentifiers.add(variable.identifier);
            uniqueVariables.push(variable);
          }
        }
      });

      set({ mappedStandardizedVariables: uniqueVariables });
    },

    updateMappedMultiColumnMeasureStandardizedVariables: () => {
      const { config, columns } = get();
      const seenIdentifiers = new Set<string>();
      const uniqueVariables: StandardizedVariable[] = [];

      Object.values(columns).forEach((column) => {
        const variable = column.standardizedVariable;
        if (variable && !seenIdentifiers.has(variable.identifier)) {
          const configEntry = Object.values(config).find(
            (item) => item.identifier === variable.identifier
          );

          if (configEntry?.is_multi_column_measure === true) {
            seenIdentifiers.add(variable.identifier);
            uniqueVariables.push(variable);
          }
        }
      });

      set({ mappedMultiColumnMeasureStandardizedVariables: uniqueVariables });
    },

    updateMappedSingleColumnStandardizedVariables: () => {
      const { singleColumnVariableIdentifiers, columns } = get();
      const seenIdentifiers = new Set<string>();
      const uniqueVariables: StandardizedVariable[] = [];

      Object.values(columns).forEach((column) => {
        const variable = column.standardizedVariable;
        if (variable && !seenIdentifiers.has(variable.identifier)) {
          if (singleColumnVariableIdentifiers.has(variable.identifier)) {
            seenIdentifiers.add(variable.identifier);
            uniqueVariables.push(variable);
          }
        }
      });

      set({ mappedSingleColumnStandardizedVariables: uniqueVariables });
    },

    updateMultiColumnMeasureVariableIdentifiers: () => {
      const { config } = get();
      const identifiers = new Set<string>();

      Object.values(config).forEach((configEntry) => {
        if (configEntry.is_multi_column_measure === true) {
          identifiers.add(configEntry.identifier);
        }
      });

      set({ multiColumnMeasureVariableIdentifiers: identifiers });
    },

    updateSingleColumnVariableIdentifiers: () => {
      const { config } = get();
      const identifiers = new Set<string>();

      Object.values(config).forEach((configEntry) => {
        if (
          configEntry.is_multi_column_measure !== true &&
          configEntry.can_have_multiple_columns === false
        ) {
          identifiers.add(configEntry.identifier);
        }
      });

      set({ singleColumnVariableIdentifiers: identifiers });
    },

    getStandardizedVariableColumns: (standardizedVariable: StandardizedVariable) =>
      Object.entries(get().columns)
        .filter(
          ([_, column]) =>
            column.standardizedVariable?.identifier === standardizedVariable.identifier
        )
        .map(([id, column]) => ({ id, header: column.header })),

    updateColumnDescription: (columnID: string, description: string | null) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnID].description = description;
        }),
      }));
    },

    updateColumnVariableType: (columnID: string, variableType: VariableType) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnID].variableType = variableType;

          if (variableType === 'Categorical') {
            const columnData = state.dataTable[columnID];
            const uniqueValues = Array.from(new Set(columnData));

            if (!draft[columnID].levels) {
              draft[columnID].levels = uniqueValues.reduce(
                (acc, value) => ({
                  ...acc,
                  [value]: { description: '' },
                }),
                {} as { [key: string]: { description: string } }
              );

              delete draft[columnID].units;
            }
          } else if (variableType === 'Continuous') {
            if (draft[columnID].units === undefined) {
              draft[columnID].units = '';
            }
            delete draft[columnID].levels;
          } else {
            delete draft[columnID].levels;
            delete draft[columnID].units;
          }
        }),
      }));
    },

    updateColumnStandardizedVariable: (
      columnID: string,
      standardizedVariable: StandardizedVariable | null
    ) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnID].standardizedVariable = standardizedVariable;

          if (get().isMultiColumnMeasureStandardizedVariable(standardizedVariable)) {
            // When setting to a multi-column measure, initialize IsPartOf if it doesn't exist
            if (!draft[columnID].isPartOf) {
              draft[columnID].isPartOf = {};
            }
            // Remove isPartOf when changing from multi-column measure to something else
          } else if (draft[columnID].isPartOf) {
            delete draft[columnID].isPartOf;
          }
        }),
      }));

      if (standardizedVariable) {
        const configEntry = Object.values(get().config).find(
          (config) => config.identifier === standardizedVariable.identifier
        );
        const variableType: VariableType = configEntry?.variable_type || null;

        // Call updateColumnVariableType with the found data_type
        get().updateColumnVariableType(columnID, variableType);
      }

      // Update mapped standardized variables when standardized variable changes
      get().updateMappedStandardizedVariables();
      get().updateMappedMultiColumnMeasureStandardizedVariables();
      get().updateMappedSingleColumnStandardizedVariables();
    },

    updateColumnIsPartOf: (
      columnID: string,
      term: { identifier: string; label: string } | null
    ) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          if (term) {
            draft[columnID].isPartOf = {
              termURL: term.identifier,
              label: term.label,
            };
          } else {
            draft[columnID].isPartOf = {};
          }
        }),
      }));
    },

    updateColumnLevelDescription: (columnID: string, value: string, description: string) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          if (draft[columnID].levels) {
            draft[columnID].levels[value].description = description;
          }
        }),
      }));
    },

    // This function is used to set the standardized term for a level of a categorical column
    updateColumnLevelTerm: (
      columnId: string,
      value: string,
      term: { identifier: string; label: string } | null
    ) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          if (draft[columnId].levels && draft[columnId].levels[value]) {
            if (term) {
              draft[columnId].levels[value] = {
                ...draft[columnId].levels[value],
                termURL: term.identifier,
                label: term.label,
              };
            } else {
              const { termURL, label, ...rest } = draft[columnId].levels[value];
              draft[columnId].levels[value] = rest;
            }
          }
        }),
      }));
    },

    updateColumnUnits: (columnID: string, unitsDescription: string) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnID].units = unitsDescription;
        }),
      }));
    },

    updateColumnMissingValues: (columnID: string, value: string, isMissing: boolean) => {
      set((state) => {
        const column = state.columns[columnID];
        if (!column) return state;

        return produce(state, (draft) => {
          const missingValues = column.missingValues || [];
          const newMissingValues = isMissing
            ? [...missingValues, value]
            : missingValues.filter((v) => v !== value);

          draft.columns[columnID].missingValues =
            newMissingValues.length > 0 ? newMissingValues : [];

          if (column.variableType === 'Categorical' && column.levels) {
            if (isMissing) {
              // Remove from levels when marking as missing
              const { [value]: removedLevel, ...remainingLevels } = column.levels;
              draft.columns[columnID].levels = remainingLevels;
            } else if (!column.levels[value]) {
              // Add back to levels when unmarking as missing
              draft.columns[columnID].levels = {
                ...column.levels,
                [value]: { description: '' },
              };
            }
          }
        });
      });
    },
    updateColumnFormat: (columnID: string, format: { termURL: string; label: string } | null) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          if (format) {
            draft[columnID].format = {
              termURL: format.termURL,
              label: format.label,
            };
          } else {
            delete draft[columnID].format;
          }
        }),
      }));
    },

    // Data dictionary
    setDataDictionary: (data: DataDictionary) => set({ uploadedDataDictionary: data }),
    setUploadedDataDictionaryFileName: (fileName: string | null) =>
      set({ uploadedDataDictionaryFileName: fileName }),
    processDataDictionaryFile: async (file: File) =>
      new Promise<void>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const dataDictionary: DataDictionary = JSON.parse(content);

            const currentColumns = get().columns;
            const { config: storeConfig } = get();

            const initialUpdates = {
              columns: { ...currentColumns },

              dataTypeUpdates: [] as Array<{
                columnId: string;
                variableType: VariableType;
              }>,
            };

            const updates = Object.entries(dataDictionary).reduce(
              (accumulator, [dataDictColumnName, columnData]) => {
                const matchingColumn = Object.entries(currentColumns).find(
                  ([_, column]) => column.header === dataDictColumnName
                );

                if (!matchingColumn) return accumulator;

                const [internalColumnID] = matchingColumn;
                let variableType: VariableType = null;

                const newColumns = produce(accumulator.columns, (draft) => {
                  draft[internalColumnID].description = columnData.Description;

                  if (columnData.Annotations?.IsAbout) {
                    const matchingConfig = Object.values(storeConfig).find(
                      (config) => config.identifier === columnData.Annotations?.IsAbout?.TermURL
                    );

                    if (matchingConfig) {
                      /*
                              NOTE: Here we read the standardized variable from the config
                               and essentially use the config identifier and label internally for the
                              standardized variable
                              This causes a mismatch between what the user uploaded and what we store
                              and they will eventually receive at the end i.e., we're overwriting their
                              dictionary according to our config
                              */
                      if (matchingConfig.variable_type) {
                        variableType = matchingConfig.variable_type;
                      }

                      draft[internalColumnID].standardizedVariable = {
                        identifier: matchingConfig.identifier,
                        label: matchingConfig.label,
                      };

                      draft[internalColumnID].variableType = variableType;
                    }
                  } else {
                    // Question: here we are removing standardizedVariable if there is no match
                    // do we want to handle this in another way?
                    delete draft[internalColumnID].standardizedVariable;
                  }

                  if (
                    get().isMultiColumnMeasureStandardizedVariable(
                      draft[internalColumnID].standardizedVariable || null
                    ) &&
                    columnData.Annotations?.IsPartOf
                  ) {
                    draft[internalColumnID].isPartOf = {
                      termURL: columnData.Annotations.IsPartOf.TermURL,
                      label: columnData.Annotations.IsPartOf.Label,
                    };
                  } else {
                    // Question: here we are removing IsPartOf if there is no match
                    // do we want to handle this in another way?
                    delete draft[internalColumnID].isPartOf;
                  }

                  // Get term info from Annotations.Levels if available and merge it with the info from the root Levels
                  if (columnData.Levels) {
                    draft[internalColumnID].variableType = 'Categorical';
                    draft[internalColumnID].levels = Object.entries(columnData.Levels).reduce(
                      (levelsAcc, [levelKey, levelValue]) => {
                        const levelObj: {
                          description: string;
                          termURL?: string;
                          label?: string;
                        } = {
                          description: levelValue.Description || '',
                        };

                        // Get term info from Annotations.Levels if available
                        const annotationLevel = columnData.Annotations?.Levels?.[levelKey];
                        if (annotationLevel) {
                          levelObj.termURL = annotationLevel.TermURL;
                          levelObj.label = annotationLevel.Label;
                        }

                        return {
                          ...levelsAcc,
                          [levelKey]: levelObj,
                        };
                      },
                      {} as {
                        [key: string]: { description: string; termURL?: string; label?: string };
                      }
                    );
                  }

                  if (columnData.Units !== undefined) {
                    draft[internalColumnID].variableType = 'Continuous';
                    draft[internalColumnID].units = columnData.Units;
                  }

                  if (columnData.Annotations?.MissingValues) {
                    draft[internalColumnID].missingValues = columnData.Annotations.MissingValues;
                  }

                  if (columnData.Annotations?.Format) {
                    draft[internalColumnID].format = {
                      termURL: columnData.Annotations.Format.TermURL,
                      label: columnData.Annotations.Format.Label,
                    };
                  }
                });

                return {
                  columns: newColumns,
                  dataTypeUpdates: [
                    ...accumulator.dataTypeUpdates,
                    { columnId: internalColumnID, variableType },
                  ],
                };
              },
              initialUpdates
            );

            set({
              uploadedDataDictionary: dataDictionary,
              columns: updates.columns,
              uploadedDataDictionaryFileName: file.name,
            });

            updates.dataTypeUpdates.forEach(({ columnId, variableType }) => {
              get().updateColumnVariableType(columnId, variableType);
            });

            // Update mapped standardized variables after processing data dictionary
            get().updateMappedStandardizedVariables();
            get().updateMappedMultiColumnMeasureStandardizedVariables();
            get().updateMappedSingleColumnStandardizedVariables();

            resolve();
          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsText(file);
      }),

    hasMultiColumnMeasures: () => get().mappedMultiColumnMeasureStandardizedVariables.length > 0,

    loadConfigOptions: async () => {
      try {
        const availableConfigs = await fetchAvailableConfigs();
        set({ configOptions: availableConfigs });
      } catch (error) {
        // TODO: show a notif error
        set({ configOptions: [] });
      }
    },

    loadConfig: async (configName: string) => {
      set({ isConfigLoading: true });
      try {
        const { config: configFile, termsData } = await fetchConfig(configName);
        const mappedConfig = mapConfigFileToStoreConfig(configFile, termsData);
        set({ config: mappedConfig });
        // Update derived state when config changes
        get().updateStandardizedVariables();
        get().updateTermOptions();
        get().updateFormatOptions();
        get().updateMappedStandardizedVariables();
        get().updateMappedMultiColumnMeasureStandardizedVariables();
        get().updateMappedSingleColumnStandardizedVariables();
        get().updateMultiColumnMeasureVariableIdentifiers();
        get().updateSingleColumnVariableIdentifiers();
        set({ isConfigLoading: false });
      } catch (error) {
        // TODO: show a notif error
        // The fallback is already handled in fetchConfig, so if we get here,
        // both remote and default config failed
        set({ isConfigLoading: false });
      }
    },

    setSelectedConfig: (configName: string | null) => {
      if (configName) {
        set({ selectedConfig: configName });
        get().loadConfig(configName);
      } else {
        set({ selectedConfig: 'Neurobagel' });
        get().loadConfig('Neurobagel');
      }
    },

    updateTermOptions: () => {
      const { config } = get();
      const termOptions: Record<string, StandardizedTerm[]> = {};

      Object.values(config).forEach((configEntry) => {
        if (configEntry.terms) {
          termOptions[configEntry.identifier] = configEntry.terms;
        } else {
          termOptions[configEntry.identifier] = [];
        }
      });

      set({ termOptions });
    },

    updateFormatOptions: () => {
      const { config } = get();
      const formatOptions: Record<string, TermFormat[]> = {};

      Object.values(config).forEach((configEntry) => {
        if (configEntry.formats) {
          formatOptions[configEntry.identifier] = configEntry.formats;
        } else {
          formatOptions[configEntry.identifier] = [];
        }
      });

      set({ formatOptions });
    },

    isMultiColumnMeasureStandardizedVariable: (
      standardizedVariable: StandardizedVariable | null | undefined
    ) => {
      if (!standardizedVariable) return false;

      const { config } = get();
      const configEntry = Object.values(config).find(
        (item) => item.identifier === standardizedVariable.identifier
      );

      return configEntry?.is_multi_column_measure === true;
    },

    // Multi-column measures state management
    initializeMultiColumnMeasuresState: (variableId: string) => {
      const { multiColumnMeasuresStates } = get();

      if (multiColumnMeasuresStates[variableId]) {
        return;
      }

      const multiColumnVariables = get().mappedMultiColumnMeasureStandardizedVariables;
      const variable = multiColumnVariables.find((v) => v.identifier === variableId);

      if (!variable) return;

      const { termOptions } = get();
      const terms = termOptions[variable.identifier] || [];
      const variableColumns = get().getStandardizedVariableColumns(variable);
      const { columns } = get();

      // Initialize term cards based on existing isPartOf relationships
      const cardMap = new Map<string, MultiColumnMeasuresTermCard>();

      variableColumns.forEach(({ id }) => {
        const column = columns[id];
        const termIdentifier = column.isPartOf?.termURL;
        const term = termIdentifier && terms.find((t) => t.identifier === termIdentifier);

        if (!term) return;

        if (!cardMap.has(term.identifier)) {
          cardMap.set(term.identifier, {
            id: uuidv4(),
            term,
            mappedColumns: [],
          });
        }

        const card = cardMap.get(term.identifier)!;
        if (!card.mappedColumns.includes(id)) {
          card.mappedColumns.push(id);
        }
      });

      const termCards = Array.from(cardMap.values());
      const finalTermCards =
        termCards.length > 0 ? termCards : [{ id: uuidv4(), term: null, mappedColumns: [] }];

      set((state) => ({
        multiColumnMeasuresStates: {
          ...state.multiColumnMeasuresStates,
          [variableId]: { terms, termCards: finalTermCards },
        },
      }));

      // Initialize column options and available terms for this variable
      get().updateColumnOptionsForVariable(variableId);
      get().updateAvailableTermsForVariable(variableId);
    },

    addTermCard: (variableId: string) => {
      set((state) => ({
        multiColumnMeasuresStates: produce(state.multiColumnMeasuresStates, (draft) => {
          if (!draft[variableId]) return;

          const newCard: MultiColumnMeasuresTermCard = {
            id: uuidv4(),
            term: null,
            mappedColumns: [],
          };

          draft[variableId].termCards.push(newCard);
        }),
      }));

      // Update available terms after adding new card
      get().updateAvailableTermsForVariable(variableId);
    },

    updateTermInCard: (variableId: string, cardId: string, term: StandardizedTerm | null) => {
      set((state) => ({
        multiColumnMeasuresStates: produce(state.multiColumnMeasuresStates, (draft) => {
          if (!draft[variableId]) return;

          const card = draft[variableId].termCards.find((c) => c.id === cardId);
          if (card) {
            card.term = term;
          }
        }),
      }));

      // Update available terms after updating term in card
      get().updateAvailableTermsForVariable(variableId);
    },

    addColumnToCard: (variableId: string, cardId: string, columnId: string) => {
      set((state) => ({
        multiColumnMeasuresStates: produce(state.multiColumnMeasuresStates, (draft) => {
          if (!draft[variableId]) return;

          const card = draft[variableId].termCards.find((c) => c.id === cardId);
          if (card && !card.mappedColumns.includes(columnId)) {
            card.mappedColumns.push(columnId);
          }
        }),
      }));

      // Update column isPartOf relationship
      const state = get().multiColumnMeasuresStates[variableId];
      if (state) {
        const card = state.termCards.find((c) => c.id === cardId);
        if (card?.term) {
          get().updateColumnIsPartOf(columnId, {
            identifier: card.term.identifier,
            label: card.term.label,
          });
        }
      }

      // Update column options after adding column to card
      get().updateColumnOptionsForVariable(variableId);
    },

    removeColumnFromCard: (variableId: string, cardId: string, columnId: string) => {
      set((state) => ({
        multiColumnMeasuresStates: produce(state.multiColumnMeasuresStates, (draft) => {
          if (!draft[variableId]) return;

          const card = draft[variableId].termCards.find((c) => c.id === cardId);
          if (card) {
            card.mappedColumns = card.mappedColumns.filter((id) => id !== columnId);
          }
        }),
      }));

      get().updateColumnIsPartOf(columnId, null);

      // Update column options after removing column from card
      get().updateColumnOptionsForVariable(variableId);
    },

    removeTermCard: (variableId: string, cardId: string) => {
      // Get the current state and find the card to remove
      const currentState = get().multiColumnMeasuresStates[variableId];
      if (!currentState) return;

      const cardToRemove = currentState.termCards.find((c) => c.id === cardId);
      if (!cardToRemove) return;

      // Clear isPartOf for all mapped columns before removing the card
      cardToRemove.mappedColumns.forEach((columnId) => {
        get().updateColumnIsPartOf(columnId, null);
      });

      // Update the state to remove the card
      set((state) => ({
        multiColumnMeasuresStates: produce(state.multiColumnMeasuresStates, (draft) => {
          if (!draft[variableId]) return;

          const newCards = draft[variableId].termCards.filter((card) => card.id !== cardId);

          // Ensure at least one empty card exists
          if (newCards.length === 0) {
            newCards.push({
              id: uuidv4(),
              term: null,
              mappedColumns: [],
            });
          }

          draft[variableId].termCards = newCards;
        }),
      }));

      // Update available terms after removing card
      get().updateAvailableTermsForVariable(variableId);
    },

    getMultiColumnMeasuresState: (variableId: string) =>
      get().multiColumnMeasuresStates[variableId] || null,

    updateColumnOptionsForVariable: (variableId: string) => {
      const state = get().multiColumnMeasuresStates[variableId];
      const { columns } = get();
      if (!state) return;

      const allMappedColumns = state.termCards.flatMap((card) => card.mappedColumns);

      const columnOptions = Object.entries(columns)
        .filter(([_, column]) => column.standardizedVariable?.identifier === variableId)
        .map(([id, column]) => ({
          id,
          label: column.header,
          disabled: allMappedColumns.includes(id),
        }));

      set((currentState) => ({
        columnOptionsForVariables: {
          ...currentState.columnOptionsForVariables,
          [variableId]: columnOptions,
        },
      }));
    },

    updateAllColumnOptionsForVariables: () => {
      const multiColumnVariables = get().mappedMultiColumnMeasureStandardizedVariables;

      multiColumnVariables.forEach((variable) => {
        get().updateColumnOptionsForVariable(variable.identifier);
      });
    },

    updateAvailableTermsForVariable: (variableId: string) => {
      const state = get().multiColumnMeasuresStates[variableId];
      if (!state) return;

      // Pre-compute available terms for each card (including 'null' for new cards)
      const availableTermsForCards: Record<string, (StandardizedTerm & { disabled: boolean })[]> =
        {};

      // For each card, compute available terms with proper disabled state
      state.termCards.forEach((card) => {
        const usedIdentifiers = state.termCards
          .filter((c) => c.term !== null && c.id !== card.id)
          .map((c) => c.term!.identifier);

        availableTermsForCards[card.id] = state.terms.map((term) => ({
          ...term,
          disabled: usedIdentifiers.includes(term.identifier),
        }));
      });

      // Also compute for 'null' (new cards that don't exist yet)
      const allUsedIdentifiers = state.termCards
        .filter((c) => c.term !== null)
        .map((c) => c.term!.identifier);

      availableTermsForCards.null = state.terms.map((term) => ({
        ...term,
        disabled: allUsedIdentifiers.includes(term.identifier),
      }));

      set((currentState) => ({
        availableTermsForVariables: {
          ...currentState.availableTermsForVariables,
          [variableId]: availableTermsForCards,
        },
      }));
    },

    reset: () =>
      set((state) => ({
        // Reset everything to initial state
        ...initialState,
        // But preserve config-related state
        configOptions: state.configOptions,
        config: state.config,
        selectedConfig: state.selectedConfig,
        isConfigLoading: state.isConfigLoading,
        standardizedVariables: state.standardizedVariables,
        multiColumnMeasureVariableIdentifiers: state.multiColumnMeasureVariableIdentifiers,
        singleColumnVariableIdentifiers: state.singleColumnVariableIdentifiers,
        termOptions: state.termOptions,
        formatOptions: state.formatOptions,
      })),
  }))
);

export default useDataStore;
