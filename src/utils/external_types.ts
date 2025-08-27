// --- Raw config file types (used for parsing config files from disk/network) ---
import { VariableType } from './internal_types';

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
  variable_type?: VariableType;
  terms_file?: string | null;
  formats?: ConfigFileTermFormat[] | null;
  required?: boolean;
  description?: string;
  is_multi_column_measure?: boolean;
  can_have_multiple_columns?: boolean;
  same_as?: string | null;
};

// The config file as it appears on disk/network (raw config)
export interface ConfigFile {
  vocabulary_name: string;
  namespace_prefix: string;
  namespace_url: string;
  version: string;
  standardized_variables: ConfigFileStandardizedVariable[];
}
