import { produce } from 'immer';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  fetchAvailableConfigs,
  fetchConfig,
  convertStandardizedVariables,
  convertStandardizedTerms,
  convertStandardizedFormats,
  readFile,
  parseTsvContent,
  applyDataDictionaryToColumns,
  applyDataTypeToColumn,
} from '../utils/data-utils';
import {
  Columns,
  DataDictionary,
  DataType,
  VariableType,
  DataStore,
} from '../utils/internal_types';

const initialState = {
  columns: {},
  standardizedVariables: {},
  standardizedTerms: {},
  standardizedFormats: {},
  uploadedDataTableFileName: null,
  config: '',
  configOptions: [],
  isConfigLoading: false,
  uploadedDataDictionary: {
    fileName: '',
    dataDictionary: {},
  },
};

const useDataStore = create<DataStore>()((set, get) => ({
  ...initialState,
  actions: {
    loadConfig: async (configName: string) => {
      set({ config: configName });
    },
    appFetchesConfigOptions: async () => {
      try {
        const availableConfigs = await fetchAvailableConfigs();
        set({ configOptions: availableConfigs });
      } catch (error) {
        // TODO: show a notif error
        set({ configOptions: [] });
      }
    },
    userSelectsConfig: async (userSelectedConfig: string | null) => {
      if (userSelectedConfig) {
        set({ isConfigLoading: true });

        try {
          const { config, termsData } = await fetchConfig(userSelectedConfig);
          const variableNameSpacePrefix = config.namespace_prefix;

          const standardizedVariables = convertStandardizedVariables(
            config.standardized_variables,
            variableNameSpacePrefix
          );

          const standardizedTerms = convertStandardizedTerms(
            termsData,
            config.standardized_variables,
            variableNameSpacePrefix
          );

          const standardizedFormats = convertStandardizedFormats(
            config.standardized_variables,
            variableNameSpacePrefix
          );

          set({
            config: userSelectedConfig,
            standardizedVariables,
            standardizedTerms,
            standardizedFormats,
          });
        } catch (error) {
          // TODO: show a notif error
          // The fallback is already handled in fetchConfig, so if we get here,
          // both remote and default config failed
        }

        set({ isConfigLoading: false });
      }
    },

    userUploadsDataTableFile: async (dataTableFile: File) => {
      try {
        const content = await readFile(dataTableFile);
        const { headers, data } = parseTsvContent(content);

        const columns: Columns = {};

        headers.forEach((header, index) => {
          const columnId = index.toString();
          const allValues = data.map((row) => row[index] || '');

          columns[columnId] = {
            id: columnId,
            name: header,
            allValues,
          };
        });

        set({
          columns,
          uploadedDataTableFileName: dataTableFile.name,
        });
      } catch (error) {
        // TODO: show a notif error
        set({
          columns: {},
          uploadedDataTableFileName: null,
        });
      }
    },
    userUploadsDataDictionaryFile: async (dataDictionaryFile: File) => {
      try {
        const content = await readFile(dataDictionaryFile);
        const dataDictionary: DataDictionary = JSON.parse(content);

        const { columns, standardizedVariables, standardizedTerms, standardizedFormats } = get();

        const updatedColumns = applyDataDictionaryToColumns(
          columns,
          dataDictionary,
          standardizedVariables,
          standardizedTerms,
          standardizedFormats
        );

        set({
          columns: updatedColumns,
          uploadedDataDictionary: {
            fileName: dataDictionaryFile.name,
            dataDictionary,
          },
        });
      } catch (error) {
        // TODO: show a notif error
        set({
          uploadedDataDictionary: {
            fileName: '',
            dataDictionary: {},
          },
        });
      }
    },
    userUpdatesColumnDescription: (columnID: string, description: string | null) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnID].description = description;
        }),
      }));
    },

    userUpdatesColumnDataType(columnID, dataType) {
      set((state) => {
        const column = state.columns[columnID];
        const updatedColumn = applyDataTypeToColumn(column, dataType, column.allValues);

        return {
          columns: produce(state.columns, (draft) => {
            draft[columnID] = updatedColumn;
          }),
        };
      });
    },

    userUpdatesMultipleColumnDataTypes(columnIDs, dataType) {
      set((state) => ({
        columns: produce(state.columns, (draft) =>
          columnIDs.forEach((columnID) => {
            const column = state.columns[columnID];

            const isMapped = !!column?.standardizedVariable;
            const isCollection =
              isMapped &&
              state.standardizedVariables[column.standardizedVariable!]?.variable_type ===
                VariableType.collection;

            // Skip updating columns that have a strictly defined data type from a mapped
            // standardized variable, unless that variable is a collection.
            if (column && (!isMapped || isCollection)) {
              draft[columnID] = applyDataTypeToColumn(column, dataType, column.allValues);
            }
          })
        ),
      }));
    },

    userUpdatesColumnStandardizedVariable(columnID, standardizedVariableId) {
      const { standardizedVariables } = get();

      set((state) => ({
        columns: produce(state.columns, (draft) => {
          const standardizedVariable = standardizedVariableId
            ? standardizedVariables[standardizedVariableId]
            : null;

          let updatedColumn = state.columns[columnID];

          if (standardizedVariable) {
            const variableType = standardizedVariable.variable_type;
            let dataType: DataType | null = null;

            if (variableType === VariableType.categorical) {
              dataType = DataType.categorical;
            } else if (variableType === VariableType.continuous) {
              dataType = DataType.continuous;
            }

            updatedColumn = applyDataTypeToColumn(
              state.columns[columnID],
              dataType,
              state.columns[columnID].allValues
            );
          } else {
            // if no standardized variable, we just clone the state to mutate it
            updatedColumn = { ...state.columns[columnID] };
          }

          updatedColumn.standardizedVariable = standardizedVariableId;

          // Handle isPartOf for multi-column measures
          if (standardizedVariable?.is_multi_column_measure) {
            if (!updatedColumn.isPartOf) {
              updatedColumn.isPartOf = '';
            }
          } else if (updatedColumn.isPartOf !== undefined) {
            delete updatedColumn.isPartOf;
          }

          draft[columnID] = updatedColumn;
        }),
      }));
    },

    userUpdatesMultipleColumnStandardizedVariables(columnIDs, standardizedVariableId) {
      const { standardizedVariables } = get();

      let dataType: DataType | null = null;
      if (standardizedVariableId !== null) {
        const standardizedVariable = standardizedVariables[standardizedVariableId];
        if (standardizedVariable) {
          const variableType = standardizedVariable.variable_type;
          if (variableType === VariableType.categorical) {
            dataType = DataType.categorical;
          } else if (variableType === VariableType.continuous) {
            dataType = DataType.continuous;
          }
        }
      }

      set((state) => ({
        columns: produce(state.columns, (draft) => {
          columnIDs.forEach((columnID) => {
            const rawColumn = state.columns[columnID];
            const updatedColumn = applyDataTypeToColumn(rawColumn, dataType, rawColumn.allValues);

            updatedColumn.standardizedVariable = standardizedVariableId;
            delete updatedColumn.isPartOf;

            draft[columnID] = updatedColumn;
          });
        }),
      }));
    },

    userUpdatesColumnToCollectionMapping(columnID, termId) {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          if (termId) {
            draft[columnID].isPartOf = termId;
          } else {
            delete draft[columnID].isPartOf;
          }
        }),
      }));
    },

    userUpdatesMultipleColumnToCollectionMappings(columnIDs, termId) {
      const { standardizedTerms } = get();

      set((state) => ({
        columns: produce(state.columns, (draft) => {
          columnIDs.forEach((columnID) => {
            if (termId) {
              draft[columnID].isPartOf = termId;
              const term = standardizedTerms[termId];
              if (term) {
                draft[columnID].standardizedVariable = term.standardizedVariableId;
              }
            } else {
              // When clear mapping is clicked, both `isPartOf` and `standardizedVariable` are removed.
              delete draft[columnID].isPartOf;
              delete draft[columnID].standardizedVariable;
            }
          });
        }),
      }));
    },

    userCreatesCollection(termId) {
      set((state) => ({
        standardizedTerms: produce(state.standardizedTerms, (draft) => {
          if (draft[termId]) {
            draft[termId].collectionCreatedAt = Date.now().toString();
          }
        }),
      }));
    },

    userDeletesCollection(termId) {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          Object.entries(draft).reduce((acc, [columnId, column]) => {
            if (column.isPartOf === termId) {
              delete draft[columnId].isPartOf;
            }
            return acc;
          }, null as null);
        }),
        standardizedTerms: produce(state.standardizedTerms, (draft) => {
          if (draft[termId]) {
            draft[termId].collectionCreatedAt = undefined;
          }
        }),
      }));
    },

    userUpdatesValueDescription(columnID, value, description) {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          const column = draft[columnID];

          column.levels![value].description = description;
        }),
      }));
    },

    userUpdatesValueStandardizedTerm(columnID, value, termId) {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnID].levels![value].standardizedTerm = termId ?? '';
        }),
      }));
    },

    userUpdatesColumnUnits(columnID, units) {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnID].units = units;
        }),
      }));
    },

    userUpdatesColumnMissingValues(columnID, value, isMissing) {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          const column = draft[columnID];
          if (!column) {
            return;
          }

          const existingMissingValues = column.missingValues ?? [];
          const updatedMissingValues = isMissing
            ? Array.from(new Set([...existingMissingValues, value]))
            : existingMissingValues.filter((missingValue) => missingValue !== value);

          column.missingValues = updatedMissingValues;

          if (column.dataType === DataType.categorical && column.levels) {
            if (isMissing) {
              if (column.levels[value]) {
                column.levels[value].standardizedTerm = '';
              } else {
                column.levels[value] = { description: '', standardizedTerm: '' };
              }
            } else if (!column.levels[value]) {
              column.levels[value] = {
                description: '',
                standardizedTerm: '',
              };
            }
          }
        }),
      }));
    },

    userUpdatesColumnFormat(columnID, formatId) {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnID].format = formatId ?? undefined;
        }),
      }));
    },

    reset: () => {
      set((state) => ({
        ...initialState,
        // Preserve config-related state
        config: state.config,
        configOptions: state.configOptions,
        isConfigLoading: state.isConfigLoading,
        standardizedVariables: state.standardizedVariables,
        standardizedTerms: state.standardizedTerms,
        standardizedFormats: state.standardizedFormats,
      }));
    },
  },
}));

export const useColumns = () => useDataStore((state) => state.columns);
export const useStandardizedVariables = () => useDataStore((state) => state.standardizedVariables);
export const useStandardizedTerms = () => useDataStore((state) => state.standardizedTerms);
export const useStandardizedFormats = () => useDataStore((state) => state.standardizedFormats);
export const useUploadedDataTableFileName = () =>
  useDataStore((state) => state.uploadedDataTableFileName);
export const useUploadedDataDictionary = () =>
  useDataStore((state) => state.uploadedDataDictionary);
export const useIsConfigLoading = () => useDataStore((state) => state.isConfigLoading);
export const useConfig = () => useDataStore((state) => state.config);
export const useConfigOptions = () => useDataStore((state) => state.configOptions);
export const useDataActions = () => useDataStore((state) => state.actions);

// Export the raw store for testing purposes
export { useDataStore };

export default devtools(useDataStore);
