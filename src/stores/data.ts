import { produce } from 'immer';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  DataTable,
  Columns,
  DataDictionary,
  StandardizedVaribleCollection,
  StandardizedVariable,
  Config,
  StandardizedTerm,
  TermFormat,
} from '../utils/internal_types';
import { fetchAvailableConfigs, fetchConfig, mapConfigFileToStoreConfig } from '../utils/util';

type DataStore = {
  dataTable: DataTable;
  columns: Columns;
  uploadedDataTableFileName: string | null;
  setDataTable: (data: DataTable) => void;
  initializeColumns: (data: Columns) => void;
  setUploadedDataTableFileName: (fileName: string | null) => void;
  processDataTableFile: (file: File) => Promise<void>;
  getStandardizedVariables: () => StandardizedVaribleCollection;
  getStandardizedVariableColumns: (
    StandardizedVariable: StandardizedVariable
  ) => { id: string; header: string }[];
  getMappedStandardizedVariables: () => StandardizedVariable[];
  getMappedMultiColumnMeasureStandardizedVariables: () => StandardizedVariable[];
  updateColumnDescription: (columnID: string, description: string | null) => void;
  updateColumnDataType: (columnID: string, dataType: 'Categorical' | 'Continuous' | null) => void;
  updateColumnStandardizedVariable: (
    columnID: string,
    standardizedVariable: StandardizedVariable | null
  ) => void;
  updateColumnIsPartOf: (
    columnID: string,
    term: { identifier: string; label: string } | null
  ) => void;
  updateColumnLevelDescription: (columnID: string, value: string, description: string) => void;
  updateColumnLevelTerm: (
    columnID: string,
    value: string,
    term: { identifier: string; label: string } | null
  ) => void;
  updateColumnUnits: (columnID: string, unitsDescription: string | null) => void;
  updateColumnMissingValues: (columnID: string, value: string, isMissing: boolean) => void;
  updateColumnFormat: (columnID: string, format: { termURL: string; label: string } | null) => void;

  uploadedDataDictionary: DataDictionary;
  uploadedDataDictionaryFileName: string | null;
  setDataDictionary: (data: DataDictionary) => void;
  setUploadedDataDictionaryFileName: (fileName: string | null) => void;
  processDataDictionaryFile: (file: File) => Promise<void>;

  config: Config;
  configOptions: string[];
  loadConfigOptions: () => Promise<void>;
  selectedConfig: string | null;
  setSelectedConfig: (configName: string | null) => void;
  loadConfig: (configName: string) => Promise<void>;
  hasMultiColumnMeasures: () => boolean;
  getTermOptions: (standardizedVariable: StandardizedVariable) => StandardizedTerm[];
  getFormatOptions: (StandardizedVariable: StandardizedVariable) => TermFormat[];
  isMultiColumnMeasureStandardizedVariable: (
    standardizedVariable: StandardizedVariable | null | undefined
  ) => boolean;

  reset: () => void;
};

const initialState = {
  dataTable: {},
  columns: {},
  uploadedDataTableFileName: null,
  uploadedDataDictionary: {},
  uploadedDataDictionaryFileName: null,
  configOptions: [],
  config: {},
};

const useDataStore = create<DataStore>()(
  devtools((set, get) => ({
    // Data table
    ...initialState,
    setDataTable: (data: DataTable) => set({ dataTable: data }),
    setUploadedDataTableFileName: (fileName: string | null) =>
      set({ uploadedDataTableFileName: fileName }),
    initializeColumns: (data: Columns) => set({ columns: data }),
    processDataTableFile: async (file: File) =>
      new Promise<void>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          const content = e.target?.result as string;
          const rows = content
            .split('\n')
            .map((row) => row.trim())
            .filter((row) => row !== '')
            .map((row) => row.split('\t'));
          const headers = rows[0];
          const data = rows.slice(1);

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
    getStandardizedVariables: () => {
      const standardizedVariableConfigs = get().config;
      return Object.fromEntries(
        Object.entries(standardizedVariableConfigs).map(([standardizedVariableName, config]) => [
          standardizedVariableName,
          { identifier: config.identifier, label: config.label },
        ])
      );
    },

    getStandardizedVariableColumns: (standardizedVariable: StandardizedVariable) =>
      Object.entries(get().columns)
        .filter(
          ([_, column]) =>
            column.standardizedVariable?.identifier === standardizedVariable.identifier
        )
        .map(([id, column]) => ({ id, header: column.header })),

    getMappedStandardizedVariables: () => {
      const { config } = get();
      const { columns } = get();
      const seenIdentifiers = new Set<string>();
      const uniqueVariables: StandardizedVariable[] = [];

      Object.values(columns).forEach((column) => {
        const variable = column.standardizedVariable;
        if (variable && !seenIdentifiers.has(variable.identifier)) {
          const configEntry = Object.values(config).find(
            (configItem) => configItem.identifier === variable.identifier
          );
          // Filter out variables with null data_type e.g., Subject ID, Session ID
          // but keep multi column measures in
          if (
            configEntry?.data_type !== null ||
            (configEntry?.data_type === null && configEntry?.is_multi_column_measure !== false)
          ) {
            seenIdentifiers.add(variable.identifier);
            uniqueVariables.push(variable);
          }
        }
      });

      return uniqueVariables;
    },

    getMappedMultiColumnMeasureStandardizedVariables: () => {
      const allMappedVariables = get().getMappedStandardizedVariables();
      const { config } = get();

      return allMappedVariables.filter((variable) => {
        const configEntry = Object.values(config).find(
          (item) => item.identifier === variable.identifier
        );
        return configEntry?.is_multi_column_measure === true;
      });
    },

    updateColumnDescription: (columnID: string, description: string | null) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnID].description = description;
        }),
      }));
    },

    updateColumnDataType: (columnID: string, dataType: 'Categorical' | 'Continuous' | null) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnID].dataType = dataType;

          if (dataType === 'Categorical') {
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
          } else if (dataType === 'Continuous') {
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

    // This function is used to set the data type of a column that has been mapped to a standardized column
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

      let dataType: 'Categorical' | 'Continuous' | null = null;
      if (standardizedVariable) {
        const configEntry = Object.values(get().config).find(
          (config) => config.identifier === standardizedVariable.identifier
        );
        dataType = configEntry?.data_type || null;
      }

      // Call updateColumnDataType with the found data_type
      get().updateColumnDataType(columnID, dataType);
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

          if (column.dataType === 'Categorical' && column.levels) {
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
                dataType: 'Categorical' | 'Continuous' | null;
              }>,
            };

            const updates = Object.entries(dataDictionary).reduce(
              (accumulator, [dataDictColumnName, columnData]) => {
                const matchingColumn = Object.entries(currentColumns).find(
                  ([_, column]) => column.header === dataDictColumnName
                );

                if (!matchingColumn) return accumulator;

                const [internalColumnID] = matchingColumn;
                let dataType: 'Categorical' | 'Continuous' | null = null;

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
                      draft[internalColumnID].standardizedVariable = {
                        identifier: matchingConfig.identifier,
                        label: matchingConfig.label,
                      };
                      dataType = matchingConfig.data_type ?? null;
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
                    draft[internalColumnID].dataType = 'Categorical';
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
                    draft[internalColumnID].dataType = 'Continuous';
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
                    { columnId: internalColumnID, dataType },
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

            updates.dataTypeUpdates.forEach(({ columnId, dataType }) => {
              get().updateColumnDataType(columnId, dataType);
            });

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

    hasMultiColumnMeasures: () =>
      get().getMappedMultiColumnMeasureStandardizedVariables().length > 0,

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
      try {
        const { config: configFile, termsData } = await fetchConfig(configName);
        const mappedConfig = mapConfigFileToStoreConfig(configFile, termsData);
        set({ config: mappedConfig });
      } catch (error) {
        // TODO: show a notif error
        // The fallback is already handled in fetchConfig, so if we get here,
        // both remote and default config failed
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

    getTermOptions: async (standardizedVariable: StandardizedVariable) => {
      const { config } = get();
      const matchingConfigEntry = Object.values(config).find(
        (configEntry) => configEntry.identifier === standardizedVariable.identifier
      );
      if (matchingConfigEntry && matchingConfigEntry.terms) {
        return matchingConfigEntry.terms;
      }
      return [];
    },

    getFormatOptions: (standardizedVariable: StandardizedVariable) => {
      const { config } = get();
      const matchingConfigEntry = Object.values(config).find(
        (configEntry) => configEntry.identifier === standardizedVariable.identifier
      );
      if (matchingConfigEntry && matchingConfigEntry.formats) {
        return matchingConfigEntry.formats;
      }
      return [];
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

    reset: () => set(initialState),
  }))
);

export default useDataStore;
