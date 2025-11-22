import { useMemo } from 'react';
import { DataType } from '../../datamodel';
import { useColumns, useStandardizedVariables } from '../stores/FreshNewStore';
import { useColumnUniqueValues } from './useColumnUniqueValues';
import type { FormatOption } from './useFormatOptions';
import { useFormatOptions } from './useFormatOptions';
import type { TermOption } from './useTermOptions';
import { useTermOptions } from './useTermOptions';

export interface ActiveValueAnnotationColumn {
  id: string;
  name: string;
  dataType: DataType | null;
  uniqueValues: string[];
  levels: Record<string, { description: string; standardizedTerm?: string }>;
  missingValues: string[];
  units: string;
  formatId: string | null;
  termOptions: TermOption[];
  formatOptions: FormatOption[];
  showStandardizedTerm: boolean;
  showMissingToggle: boolean;
  showFormat: boolean;
  showUnits: boolean;
}

/**
 * Aggregates all per-column data needed to render the Value Annotation panel for
 * a specific column identifier.
 */
export function useValueAnnotationColumn(
  columnId: string | null
): ActiveValueAnnotationColumn | null {
  const safeColumnId = columnId ?? '';
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();

  const column = columns[safeColumnId];
  const uniqueValues = useColumnUniqueValues(safeColumnId);
  const standardizedVariableId = column?.standardizedVariable ?? null;
  const standardizedVariable = standardizedVariableId
    ? standardizedVariables[standardizedVariableId]
    : null;
  const termOptions = useTermOptions(standardizedVariableId ?? '');
  const formatOptions = useFormatOptions(standardizedVariableId ?? '');
  const isMultiColumnMeasure = Boolean(standardizedVariable?.is_multi_column_measure);

  return useMemo(() => {
    if (!column) {
      return null;
    }

    // Multi-column measure variables (Collection) do not receive a dataType from the store.
    // To mirror the legacy behavior (which rendered the continuous component for these groups),
    // default them to continuous when the user hasn't manually selected a type.
    const dataType = column.dataType ?? (isMultiColumnMeasure ? DataType.continuous : null);
    const showStandardizedTerm =
      dataType === DataType.categorical &&
      Boolean(standardizedVariableId) &&
      !isMultiColumnMeasure &&
      termOptions.length > 0;

    const showFormat = dataType === DataType.continuous && formatOptions.length > 0;
    const showUnits = dataType === DataType.continuous;
    const showMissingToggle = uniqueValues.length > 0;

    return {
      id: column.id,
      name: column.name ?? column.id,
      dataType,
      uniqueValues,
      levels: column.levels ?? {},
      missingValues: column.missingValues ?? [],
      units: column.units ?? '',
      formatId: column.format ?? null,
      termOptions,
      formatOptions,
      showStandardizedTerm,
      showMissingToggle,
      showFormat,
      showUnits,
    };
  }, [
    column,
    formatOptions,
    isMultiColumnMeasure,
    standardizedVariableId,
    termOptions,
    uniqueValues,
  ]);
}

export default useValueAnnotationColumn;
