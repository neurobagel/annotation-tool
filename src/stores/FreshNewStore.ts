import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FreshDataStoreState, FreshDataStoreActions } from '../../datamodel';

type FreshDataStore = FreshDataStoreState & {
  actions: FreshDataStoreActions;
};

const useFreshDataStore = create<FreshDataStore>()((set, get) => ({
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
    loadConfig: async (configName: string) => {},
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
