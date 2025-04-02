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
  levels?: { [key: string]: { description: string } } | null;
  units?: string;
};

export type Columns = {
  [key: string]: Column;
};

export interface DataDictionary {
  [key: string]: {
    Description: string;
    Levels?: { [key: string]: string };
    Units?: string;
    Annotations?: {
      IsAbout?: {
        // Made optional
        TermURL: string;
        Label: string;
      };
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
        // Made optional
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

export interface StandardizedVaribleCollection {
  [key: string]: StandardizedVariable;
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
