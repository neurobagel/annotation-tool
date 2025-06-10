export type DataTable = {
  [key: string]: string[];
};

export type Column = {
  header: string;
  description?: string | null;
  dataType?: 'Categorical' | 'Continuous' | null;
  standardizedVariable?: StandardizedVariable | null;
  isPartOf?: {
    termURL?: string;
    label?: string;
  };
  levels?: { [key: string]: { description: string; label?: string; termURL?: string } } | null;
  units?: string;
  missingValues?: string[];
  format?: Format;
};

export type Columns = {
  [key: string]: Column;
};

export type ColumnEntry = [string, Column];

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
      Identifies?: string;
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

export interface StandardizedVariable {
  identifier: string;
  label: string;
}

export interface StandardizedVariableConfig extends StandardizedVariable {
  data_type?: 'Categorical' | 'Continuous' | null;
  is_multi_column_measurement?: boolean;
  vocab_file?: string | null;
  formats?: Format[];
}

export interface StandardizedVaribleCollection {
  [key: string]: StandardizedVariable;
}

// TODO: reduce the depth and try to have a single object for all configuration
export interface Config {
  [key: string]: StandardizedVariableConfig;
}

export interface StandardizedTerm {
  identifier: string;
  label: string;
}

export interface Format {
  termURL: string;
  label: string;
  example?: string[];
}

export interface MultiColumnMeasuresTerm extends StandardizedTerm {
  disabled?: boolean;
}

export interface MultiColumnMeasuresTermCard {
  id: string;
  term: MultiColumnMeasuresTerm | null;
  mappedColumns: string[];
}

export enum View {
  Landing = 'landing',
  Upload = 'upload',
  ColumnAnnotation = 'columnAnnotation',
  MultiColumnMeasures = 'multiColumnMeasures',
  ValueAnnotation = 'valueAnnotation',
  Download = 'download',
}

export type StepConfig = {
  label: string;
  view: View;
  icon: React.ComponentType;
};

export type ConfigLoaderOptions = {
  excludeDefault?: boolean;
  defaultConfigName?: string;
};
