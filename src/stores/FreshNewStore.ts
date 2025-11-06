import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  FreshDataStoreState,
  FreshDataStoreActions,
  Columns,
  DataDictionary,
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

export default devtools(useFreshDataStore);
