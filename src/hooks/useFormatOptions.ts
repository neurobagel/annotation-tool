import { useStandardizedFormats } from '../stores/data';

export interface FormatOption {
  id: string;
  label: string;
  examples?: string[];
}

/** Returns standardized format options for a standardized variable. */
export function useFormatOptions(variableId: string): FormatOption[] {
  const standardizedFormats = useStandardizedFormats();

  return Object.values(standardizedFormats)
    .filter((format) => format.standardizedVariableId === variableId)
    .map((format) => ({
      id: format.identifier,
      label: format.label,
      examples: format.examples,
    }));
}

export default useFormatOptions;
