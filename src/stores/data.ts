import { create } from 'zustand';
import { DataTable, Columns } from '../utils/types';

type DataStore = {
  dataTable: DataTable;
  columns: Columns;
  uploadedDataTableFileName: string | null;
  setDataTable: (data: DataTable) => void;
  initializeColumns: (data: Columns) => void;
  setUploadedDataTableFileName: (fileName: string | null) => void;
  processFile: (file: File) => Promise<void>;
};

const useDataStore = create<DataStore>((set) => ({
  dataTable: {},
  columns: {},
  uploadedDataTableFileName: null,
  setDataTable: (data: DataTable) => set({ dataTable: data }),
  initializeColumns: (data: Columns) => set({ columns: data }),
  setUploadedDataTableFileName: (fileName: string | null) =>
    set({ uploadedDataTableFileName: fileName }),
  processFile: async (file: File) =>
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
}));

export default useDataStore;
