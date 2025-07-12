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
export type ConfigFileStandardizedVariable = {
  id: string;
  name: string;
  data_type?: 'Categorical' | 'Continuous' | null;
  terms_file?: string;
  formats?: ConfigFileTermFormat[];
  required?: boolean;
  description?: string;
  is_multi_column_measurement?: boolean;
  can_have_multiple_columns?: boolean;
  same_as?: string;
};

// The config file as it appears on disk/network (raw config)
export interface ConfigFile {
  vocabulary_name: string;
  namespace_prefix: string;
  namespace_url: string;
  version: string;
  standardized_variables: ConfigFileStandardizedVariable[];
}
