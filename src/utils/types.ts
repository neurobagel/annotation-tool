export type DataTable = {
  [key: string]: string[];
};
export type Column = {
  header: string;
  description?: string | null;
  dataType?: 'Categorical' | 'Continuous' | null;
  standardizedVariable?: StandardizedVarible | null;
  levels?: { [key: string]: { description: string } } | null;
  units?: string | null;
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
      IsAbout: {
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
        TermURL: string;
        Label: string;
      };
      MissingValues?: string[];
    };
  };
}

export interface StandardizedVarible {
  identifier: string;
  label: string;
}

export interface StandardizedVaribleCollection {
  [key: string]: StandardizedVarible;
}

export enum View {
  Landing = 'landing',
  Upload = 'upload',
  ColumnAnnotation = 'columnAnnotation',
  ValueAnnotation = 'valueAnnotation',
  Download = 'download',
}

export type StepConfig = {
  label: string;
  view: View;
  icon: React.ComponentType;
};
