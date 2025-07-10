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
  format?: TermFormat;
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
  terms?: StandardizedTerm[] | null;
  formats?: TermFormat[];
  required?: boolean;
  description?: string;
  is_multi_column_measurement?: boolean;
  can_have_multiple_columns?: boolean;
  same_as?: string;
  // TODO: remove identifies
  identifies?: string;
}

export interface StandardizedVaribleCollection {
  [key: string]: StandardizedVariable;
}

// TODO: reduce the depth and try to have a single object for all configuration
// The main config object used in the app
export interface Config {
  [key: string]: StandardizedVariableConfig;
}

export interface StandardizedTerm {
  identifier: string;
  label: string;
  abbreviation?: string;
  description?: string;
  same_as?: string;
  status?: string;
}

export interface TermFormat {
  termURL: string;
  label: string;
  examples?: string[];
}

// --- Raw config file types (used for parsing config files from disk/network) ---

// A term as it appears in a terms file (raw config)
export type TermsFileStandardizedTerm = {
  id: string;
  name: string;
  abbreviation?: string;
  description?: string;
  same_as?: string;
  status?: string;
};

// A format as it appears in a config file (raw config)
export type ConfigFileTermFormat = {
  id: string;
  name: string;
  examples?: string[];
};

// A vocabulary config as it appears in a terms file (raw config)
export interface VocabConfig {
  namespace_prefix: string;
  namespace_url: string;
  vocabulary_name: string;
  version: string;
  terms: TermsFileStandardizedTerm[];
}

// A standardized variable as it appears in a config file (raw config)
export type ConfigFileStandardizedVariable = Omit<
  StandardizedVariableConfig,
  'identifier' | 'label' | 'terms' | 'formats' | 'identifies'
> & {
  id: string;
  name: string;
  terms_file?: string;
  formats?: ConfigFileTermFormat[];
};

// The config file as it appears on disk/network (raw config)
export interface ConfigFile {
  vocabulary_name: string;
  namespace_prefix: string;
  namespace_url: string;
  version: string;
  standardized_variables: ConfigFileStandardizedVariable[];
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
