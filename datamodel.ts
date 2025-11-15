export enum VariableType {
  identifier = 'Identifier',
  categorical = 'Categorical',
  continuous = 'Continuous',
  collection = 'Collection',
}

export enum DataType {
  categorical = 'Categorical',
  continuous = 'Continuous',
}

export interface DataTable {
  [key: string]: string[];
}

interface Column {
  id: string;
  name: string;
  allValues: string[]; // because we want to show the datable preview
  description?: string | null;
  dataType?: DataType | null;
  isPartOf?: string; // foreign key (primary key in terms table) to standardized term in the terms for the corresponding standardized variable
  levels?: { [key: string]: { description: string; standardizedTerm: string } } | null; // foreign key to standardized term
  units?: string;
  standardizedVariable?: string | null; // foreign key to standardized variable
  missingValues?: string[];
  format?: string; // foreign key to term format
}

export interface Columns {
  [key: string]: Column;
}

export interface StandardizedVariable {
  id: string;
  name: string;
  variable_type?: VariableType;
  required?: boolean;
  description?: string;
  is_multi_column_measure?: boolean;
  can_have_multiple_columns?: boolean;
  same_as?: string | null;
}

export interface StandardizedVariables {
  [key: string]: StandardizedVariable;
}

// Includes all terms in one place
export interface StandardizedTerm {
  standardizedVariableId: string; // foreign key (primary key in the standardized variable table) to standardized variable
  id: string;
  label: string;
  abbreviation?: string;
  description?: string;
  same_as?: string;
  status?: string;
  isCollection?: boolean;
}

export interface StandardizedTerms {
  [key: string]: StandardizedTerm;
}

interface StandardizedFormat {
  standardizedVariableId: string; // foreign key (primary key in the standardized variable table) to standardized variable
  identifier: string;
  label: string;
  examples?: string[];
}

export interface StandardizedFormats {
  [key: string]: StandardizedFormat;
}

export interface DataDictionary {
  [key: string]: {
    Description: string;
    Levels?: { [key: string]: { Description: string; TermURL?: string } };
    Units?: string;
    Annotations?: {
      IsAbout?: {
        TermURL: string;
        Label: string;
      };
      VariableType?: VariableType;
      Format?: {
        TermURL: string;
        Label: string;
      };
      Levels?: {
        [key: string]: {
          TermURL: string;
          Label: string;
        };
      };
      IsPartOf?: {
        TermURL: string;
        Label: string;
      };
      MissingValues?: string[];
    };
  };
}

export interface UploadedDataDictionaryFile {
  fileName: string;
  dataDictionary: DataDictionary;
}

export type FreshDataStoreState = {
  columns: Columns;
  standardizedVariables: StandardizedVariables;
  standardizedTerms: StandardizedTerms;
  standardizedFormats: StandardizedFormats;
  uploadedDataTableFileName: string | null;
  isConfigLoading: boolean;
  config: string;
  configOptions: string[];
  uploadedDataDictionary: UploadedDataDictionaryFile;
};

export type FreshDataStoreActions = {
  loadConfig: (configName: string) => Promise<void>;
  appFetchesConfigOptions: () => Promise<void>;
  userSelectsConfig: (userSelectedConfig: string | null) => Promise<void>;
  userUploadsDataTableFile: (dataTableFile: File) => Promise<void>;
  userUploadsDataDictionaryFile: (dataDictionaryFile: File) => Promise<void>;
  userUpdatesColumnDescription: (columnID: string, description: string | null) => void;
  userUpdatesColumnDataType: (columnID: string, dataType: DataType | null) => void;
  userUpdatesColumnStandardizedVariable: (
    columnID: string,
    standardizedVariableId: string | null
  ) => void;
  userUpdatesColumnIsPartOf: (columnID: string, termId: string | null) => void;
  userUpdatesMultiColumnMeasureCards: (termId: string, isCollection: boolean) => void;
  reset: () => void;
};

export type FreshDataStore = FreshDataStoreState & {
  actions: FreshDataStoreActions;
};
