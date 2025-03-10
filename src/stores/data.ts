import { create } from 'zustand';
import { produce } from 'immer';
import { devtools } from 'zustand/middleware';
import defaultConfig from '../../configs/default.json';
import {
  DataTable,
  Columns,
  DataDictionary,
  StandardizedVaribleCollection,
  StandardizedVarible,
} from '../utils/types';

type DataStore = {
  dataTable: DataTable;
  columns: Columns;
  uploadedDataTableFileName: string | null;
  setDataTable: (data: DataTable) => void;
  initializeColumns: (data: Columns) => void;
  setUploadedDataTableFileName: (fileName: string | null) => void;
  processDataTableFile: (file: File) => Promise<void>;
  updateColumnDescription: (columnId: string, description: string | null) => void;
  updateColumnDataType: (columnId: string, dataType: 'Categorical' | 'Continuous' | null) => void;
  updateColumnStandardizedVariable: (
    columnId: string,
    standardizedVariable: StandardizedVarible | null
  ) => void;

  uploadedDataDictionary: DataDictionary;
  uploadedDataDictionaryFileName: string | null;
  setDataDictionary: (data: DataDictionary) => void;
  setUploadedDataDictionaryFileName: (fileName: string | null) => void;
  processDataDictionaryFile: (file: File) => Promise<void>;

  standardizedVaribles: StandardizedVaribleCollection;
};

const useDataStore = create<DataStore>()(
  devtools((set, get) => ({
    // Data table
    dataTable: {},
    columns: {},
    uploadedDataTableFileName: null,
    setDataTable: (data: DataTable) => set({ dataTable: data }),
    setUploadedDataTableFileName: (fileName: string | null) =>
      set({ uploadedDataTableFileName: fileName }),
    initializeColumns: (data: Columns) => set({ columns: data }),
    processDataTableFile: async (file: File) =>
      new Promise<void>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          const content = e.target?.result as string;
          const rows = content.split('\n').map((row) => row.split('\t'));
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
    updateColumnDescription: (columnId: string, description: string | null) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnId].description = description;
        }),
      }));
    },

    updateColumnDataType: (columnId: string, dataType: 'Categorical' | 'Continuous' | null) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnId].dataType = dataType;
        }),
      }));
    },

    updateColumnStandardizedVariable: (
      columnId: string,
      standardizedVariable: StandardizedVarible | null
    ) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnId].standardizedVariable = standardizedVariable;
        }),
      }));
    },

    // Data dictionary
    uploadedDataDictionary: {},
    uploadedDataDictionaryFileName: null,
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

            const updatedColumns = Object.entries(dataDictionary).reduce(
              (acc, [key, value]) => {
                const columnEntry = Object.entries(currentColumns).find(
                  ([_, column]) => column.header === key
                );

                if (columnEntry) {
                  const [columnId] = columnEntry;
                  // Use Immer's produce to update the nested column description
                  return produce(acc, (draft) => {
                    draft[columnId].description = value.Description;
                  });
                }
                return acc;
              },
              { ...currentColumns }
            );

            set({
              uploadedDataDictionary: dataDictionary,
              columns: updatedColumns,
              uploadedDataDictionaryFileName: file.name,
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

    // Config
    standardizedVaribles: defaultConfig.standardizedVariables,
  }))
);

export default useDataStore;
