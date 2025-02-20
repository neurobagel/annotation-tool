import { create } from 'zustand';
import * as R from 'ramda';
import { DataTable, Columns, DataDictionary } from '../utils/types';

type DataStore = {
  dataTable: DataTable;
  columns: Columns;
  uploadedDataDictionary: DataDictionary;
  uploadedDataTableFileName: string | null;
  uploadedDataDictionaryFileName: string | null;
  setDataTable: (data: DataTable) => void;
  initializeColumns: (data: Columns) => void;
  setDataDictionary: (data: DataDictionary) => void;
  setUploadedDataTableFileName: (fileName: string | null) => void;
  setUploadedDataDictionaryFileName: (fileName: string | null) => void;
  processDataTableFile: (file: File) => Promise<void>;
  processDataDictionaryFile: (file: File) => Promise<void>;
};

const useDataStore = create<DataStore>((set, get) => ({
  dataTable: {},
  columns: {},
  uploadedDataDictionary: {},
  uploadedDataTableFileName: null,
  uploadedDataDictionaryFileName: null,
  setDataTable: (data: DataTable) => set({ dataTable: data }),
  initializeColumns: (data: Columns) => set({ columns: data }),
  setDataDictionary: (data: DataDictionary) => set({ uploadedDataDictionary: data }),
  setUploadedDataTableFileName: (fileName: string | null) =>
    set({ uploadedDataTableFileName: fileName }),
  setUploadedDataDictionaryFileName: (fileName: string | null) =>
    set({ uploadedDataDictionaryFileName: fileName }),
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
          columnData[columnIndex + 1] = data.map((row) => row[columnIndex]);
        });

        const columns: Columns = headers.reduce((acc, header, index) => {
          acc[index + 1] = { header };
          return acc;
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
                // Use Ramda's assocPath to update the nested column description
                return R.assocPath([columnId, 'description'], value.Description, acc);
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
}));

export default useDataStore;
