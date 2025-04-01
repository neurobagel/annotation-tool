import { produce } from 'immer';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import defaultConfig from '../../configs/default.json';
import {
  DataTable,
  Columns,
  DataDictionary,
  StandardizedVaribleCollection,
  StandardizedVariable,
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
    standardizedVariable: StandardizedVariable | null
  ) => void;
  updateColumnIsPartOf: (
    columnId: string,
    term: { identifier: string; label: string } | null
  ) => void;
  updateColumnLevelDescription: (columnId: string, value: string, description: string) => void;
  updateColumnUnits: (columnId: string, unitsDescription: string | null) => void;

  uploadedDataDictionary: DataDictionary;
  uploadedDataDictionaryFileName: string | null;
  setDataDictionary: (data: DataDictionary) => void;
  setUploadedDataDictionaryFileName: (fileName: string | null) => void;
  processDataDictionaryFile: (file: File) => Promise<void>;

  standardizedVariables: StandardizedVaribleCollection;
  hasMultiColumnMeasures: () => boolean;

  reset: () => void;
};

const initialState = {
  dataTable: {},
  columns: {},
  uploadedDataTableFileName: null,
  uploadedDataDictionary: {},
  uploadedDataDictionaryFileName: null,
  standardizedVariables: defaultConfig.standardizedVariables,
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

          if (dataType === 'Categorical') {
            const columnData = state.dataTable[columnId];
            const uniqueValues = Array.from(new Set(columnData));

            draft[columnId].levels = uniqueValues.reduce(
              (acc, value) => ({
                ...acc,
                [value]: { description: '' },
              }),
              {} as { [key: string]: { description: string } }
            );

            delete draft[columnId].units;
          } else if (dataType === 'Continuous') {
            draft[columnId].units = '';

            delete draft[columnId].levels;
          } else {
            delete draft[columnId].levels;
            delete draft[columnId].units;
          }
        }),
      }));
    },

    updateColumnStandardizedVariable: (
      columnId: string,
      standardizedVariable: StandardizedVariable | null
    ) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          const assessmentToolConfig = state.standardizedVariables['Assessment Tool'];

          draft[columnId].standardizedVariable = standardizedVariable;

          if (standardizedVariable?.identifier === assessmentToolConfig.identifier) {
            // When setting to Assessment Tool, initialize IsPartOf if it doesn't exist
            if (!draft[columnId].isPartOf) {
              draft[columnId].isPartOf = {};
            }
            // Remove isPartOf when changing from Assessment Tool to something else
          } else if (draft[columnId].isPartOf) {
            delete draft[columnId].isPartOf;
          }
        }),
      }));
    },

    updateColumnIsPartOf: (
      columnId: string,
      term: { identifier: string; label: string } | null
    ) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          if (term) {
            draft[columnId].isPartOf = {
              termURL: term.identifier,
              label: term.label,
            };
          } else {
            delete draft[columnId].isPartOf;
          }
        }),
      }));
    },

    updateColumnLevelDescription: (columnId: string, value: string, description: string) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          if (draft[columnId].levels) {
            draft[columnId].levels[value].description = description;
          }
        }),
      }));
    },

    updateColumnUnits: (columnId: string, unitsDescription: string) => {
      set((state) => ({
        columns: produce(state.columns, (draft) => {
          draft[columnId].units = unitsDescription;
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

            const updatedColumns = Object.entries(dataDictionary).reduce(
              (acc, [key, value]) => {
                const columnEntry = Object.entries(currentColumns).find(
                  ([_, column]) => column.header === key
                );

                if (columnEntry) {
                  const [columnId] = columnEntry;
                  // Use Immer's produce to update the nested column description and levels
                  return produce(acc, (draft) => {
                    draft[columnId].description = value.Description;

                    if (value.Levels) {
                      draft[columnId].dataType = 'Categorical';
                      draft[columnId].levels = Object.entries(value.Levels).reduce(
                        (levelsAcc, [levelKey, levelValue]) => ({
                          ...levelsAcc,
                          [levelKey]: { description: levelValue },
                        }),
                        {} as { [key: string]: { description: string } }
                      );
                    }
                    if (value.Units !== undefined) {
                      draft[columnId].dataType = 'Continuous';
                      draft[columnId].units = value.Units;
                    }
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

    hasMultiColumnMeasures: () => {
      const { columns } = get();
      const assessmentToolConfig = get().standardizedVariables['Assessment Tool'];
      return Object.values(columns).some(
        (column) => column.standardizedVariable?.identifier === assessmentToolConfig.identifier
      );
    },

    reset: () => set(initialState),
  }))
);

export default useDataStore;
