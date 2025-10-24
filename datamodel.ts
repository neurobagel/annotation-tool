type column = {
  name: string;
  allValues: [string]; // because we want to show the datable preview
  description?: string;
  variableType?: string;
  isPartOf?: string; // foreign key (primary key in terms table) to standardized term in the terms for the corresponding standardized variable
  levels?: { [key: string]: { description: string; standardizedTerm: string } } | null; // foreign key to standardized term
  units?: string;
  standardizedVariable?: string; // foreign key to standardized variable
  missingValues?: string[];
  format?: string; // foreign key to term format
};

type standardizedVariable = {
  name: string;
  identifier: string;
  variable_type?: VariableType;
  required?: boolean;
  description?: string;
  is_multi_column_measure?: boolean;
  can_have_multiple_columns?: boolean;
  same_as?: string | null;
};

// Includes all terms in one place
interface StandardizedTerm {
  [key: string]: {
    standardizedVariableId: string; // foreign key (primary key in the standardized variable table) to standardized variable
    identifier: string;
    label: string;
    abbreviation?: string;
    description?: string;
    same_as?: string;
    status?: string;
  };
}

interface TermFormat {
  [key: string]: {
    standardizedVariableId: string; // foreign key (primary key in the standardized variable table) to standardized variable
    identifier: string;
    label: string;
    examples?: string[];
  };
}

const config: string = ' ';
const configOptions: string[] = [''];
