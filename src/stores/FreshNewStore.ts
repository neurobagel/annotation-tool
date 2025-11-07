import { produce } from 'immer';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  FreshDataStoreState,
  FreshDataStoreActions,
  Columns,
  DataDictionary,
  DataType,
  VariableType,
} from '../../datamodel';
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
} from '../utils/store-utils';

type FreshDataStore = FreshDataStoreState & {
  actions: FreshDataStoreActions;
};

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

const useFreshDataStore = create<FreshDataStore>()((set, get) => ({
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
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          applyDataTypeToColumn(draft[columnID], dataType, state.columns[columnID].allValues);
        }),
      }));
    },

    userUpdatesColumnStandardizedVariable(columnID, standardizedVariableId) {
      const { standardizedVariables } = get();

      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnID].standardizedVariable = standardizedVariableId;

          // Handle isPartOf for multi-column measures
          const standardizedVariable = standardizedVariableId
            ? standardizedVariables[standardizedVariableId]
            : null;

          if (standardizedVariable?.is_multi_column_measure) {
            // When setting to a multi-column measure, initialize isPartOf if it doesn't exist
            if (!draft[columnID].isPartOf) {
              draft[columnID].isPartOf = '';
            }
          } else if (draft[columnID].isPartOf !== undefined) {
            // Remove isPartOf when changing from multi-column measure to something else
            delete draft[columnID].isPartOf;
          }

          // Apply data type from standardized variable if available
          if (standardizedVariable) {
            const variableType = standardizedVariable.variable_type;
            let dataType: DataType | null = null;

            if (variableType === VariableType.categorical) {
              dataType = DataType.categorical;
            } else if (variableType === VariableType.continuous) {
              dataType = DataType.continuous;
            }

            applyDataTypeToColumn(draft[columnID], dataType, state.columns[columnID].allValues);
          }
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

export const useColumns = () => useFreshDataStore((state) => state.columns);
export const useStandardizedVariables = () =>
  useFreshDataStore((state) => state.standardizedVariables);
export const useStandardizedTerms = () => useFreshDataStore((state) => state.standardizedTerms);
export const useStandardizedFormats = () => useFreshDataStore((state) => state.standardizedFormats);
export const useUploadedDataTableFileName = () =>
  useFreshDataStore((state) => state.uploadedDataTableFileName);
export const useUploadedDataDictionary = () =>
  useFreshDataStore((state) => state.uploadedDataDictionary);
export const useIsConfigLoading = () => useFreshDataStore((state) => state.isConfigLoading);
export const useConfig = () => useFreshDataStore((state) => state.config);
export const useConfigOptions = () => useFreshDataStore((state) => state.configOptions);
export const useFreshDataActions = () => useFreshDataStore((state) => state.actions);

// Export the raw store for testing purposes
export { useFreshDataStore };

export default devtools(useFreshDataStore);
