export interface TermDisplay {
  id: string;
  label: string;
  abbreviation?: string;
}

export interface AvailableTerm extends TermDisplay {
  disabled: boolean;
}

export interface CardDisplay {
  id: string;
  term: TermDisplay | null;
  mappedColumns: string[];
}

export interface ColumnOption {
  id: string;
  label: string;
  isPartOfCollection: boolean;
}

export interface MultiColumnCardData {
  id: string;
  cardDisplay: CardDisplay;
  availableTerms: AvailableTerm[];
  columnOptions: ColumnOption[];
  mappedColumnHeaders: Record<string, string>;
}

export interface VariableColumnSummary {
  id: string;
  header: string;
}
