export type DataTable = {
  [key: number]: string[];
};
export type Column = {
  header: string;
  description?: string;
};
export type Columns = {
  [key: number]: Column;
};
export interface DataDictionary {
  [key: string]: {
    Description: string;
    Levels?: { [key: string]: string };
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
