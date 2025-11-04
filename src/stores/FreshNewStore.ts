import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  FreshDataStoreState,
  FreshDataStoreActions,
  StandardizedVariables,
  StandardizedTerms,
  StandardizedFormats,
  Columns,
} from '../../datamodel';
import {
  fetchAvailableConfigs,
  fetchConfig,
  readFile,
  parseTsvContent,
} from '../utils/store-utils';

type FreshDataStore = FreshDataStoreState & {
  actions: FreshDataStoreActions;
};

const useFreshDataStore = create<FreshDataStore>()((set) => ({
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
          const namespacePrefix = config.namespace_prefix;

          // Convert standardized variables
          const standardizedVariables: StandardizedVariables = {};
          config.standardized_variables.forEach((variable) => {
            const identifier = `${namespacePrefix}:${variable.id}`;
            const { id, name, terms_file: termsFile, formats: rawFormats, ...rest } = variable;
            standardizedVariables[identifier] = {
              id: identifier,
              name,
              ...rest,
            };
          });

          // Convert standardized terms from all terms files
          const standardizedTerms: StandardizedTerms = {};
          Object.entries(termsData).forEach(([fileName, vocabsArray]) => {
            vocabsArray.forEach((vocab) => {
              const termsNamespace = vocab.namespace_prefix;
              vocab.terms.forEach((term) => {
                const termIdentifier = `${termsNamespace}:${term.id}`;
                const { id, name, ...restTermFields } = term;

                // Find which standardized variable this term belongs to
                const parentVariable = config.standardized_variables.find(
                  (v) => v.terms_file === fileName
                );
                const standardizedVariableId = parentVariable
                  ? `${namespacePrefix}:${parentVariable.id}`
                  : '';

                standardizedTerms[termIdentifier] = {
                  standardizedVariableId,
                  id: termIdentifier,
                  label: name,
                  ...restTermFields,
                };
              });
            });
          });

          // Convert standardized formats from all standardized variables
          const standardizedFormats: StandardizedFormats = {};
          config.standardized_variables.forEach((variable) => {
            if (variable.formats) {
              const standardizedVariableId = `${namespacePrefix}:${variable.id}`;
              variable.formats.forEach((format) => {
                const formatIdentifier = `${namespacePrefix}:${format.id}`;
                const { id, name, ...restFormatFields } = format;
                standardizedFormats[formatIdentifier] = {
                  standardizedVariableId,
                  identifier: formatIdentifier,
                  label: name,
                  ...restFormatFields,
                };
              });
            }
          });

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
  },
}));

export const useColumns = () => useFreshDataStore((state) => state.columns);
export const useStandardizedVariables = () =>
  useFreshDataStore((state) => state.standardizedVariables);
export const useStandardizedTerms = () => useFreshDataStore((state) => state.standardizedTerms);
export const useStandardizedFormats = () => useFreshDataStore((state) => state.standardizedFormats);
export const useUploadedDataTableFileName = () =>
  useFreshDataStore((state) => state.uploadedDataTableFileName);
export const useIsConfigLoading = () => useFreshDataStore((state) => state.isConfigLoading);
export const useConfig = () => useFreshDataStore((state) => state.config);
export const useConfigOptions = () => useFreshDataStore((state) => state.configOptions);
export const useFreshDataActions = () => useFreshDataStore((state) => state.actions);

export default devtools(useFreshDataStore);
