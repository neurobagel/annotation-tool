import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FreshDataStoreState, FreshDataStoreActions } from '../../datamodel';
import { fetchAvailableConfigs, fetchConfig } from '../utils/store-utils';

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
    userSelectsConfig: async (userSelectedConfig: string) => {
      set({ isConfigLoading: true });

      try {
        const { config, termsData } = await fetchConfig(userSelectedConfig);
        set({ config: userSelectedConfig });
        //
      } catch (error) {
        // TODO: show a notif error
        // The fallback is already handled in fetchConfig, so if we get here,
        // both remote and default config failed
      }

      set({ isConfigLoading: false });
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
