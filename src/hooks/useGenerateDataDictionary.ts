import { useMemo } from 'react';
import {
  useColumns,
  useStandardizedFormats,
  useStandardizedTerms,
  useStandardizedVariables,
} from '../stores/data';
import { validateContinuousValues } from '../utils/data-utils';
import {
  Column,
  Columns,
  DataDictionary,
  DataType,
  StandardizedTerms,
  VariableType,
} from '../utils/internal_types';

const mapDataTypeToVariableType = (dataType?: DataType | null): VariableType | undefined => {
  if (dataType === DataType.categorical) {
    return VariableType.categorical;
  }
  if (dataType === DataType.continuous) {
    return VariableType.continuous;
  }
  return undefined;
};

type ColumnLevels = NonNullable<Columns[string]['levels']>;
type DataDictionaryLevels = NonNullable<DataDictionary[string]['Levels']>;
type AnnotationLevels = NonNullable<NonNullable<DataDictionary[string]['Annotations']>['Levels']>;

const buildColumnLevelsDictionary = (
  levels: ColumnLevels | null | undefined
): DataDictionaryLevels =>
  Object.fromEntries(
    Object.entries(levels ?? {}).map(([levelValue, levelData]) => [
      levelValue,
      {
        Description: levelData.description ?? '',
        ...(levelData.standardizedTerm ? { TermURL: levelData.standardizedTerm } : {}),
      },
    ])
  );

const buildAnnotationLevelsDictionary = (
  levels: ColumnLevels | null | undefined,
  standardizedTerms: StandardizedTerms,
  missingValues: string[] = []
): AnnotationLevels =>
  Object.fromEntries(
    Object.entries(levels ?? {})
      // Missing values are excluded from the Annotations.Levels dictionary because they do not
      // represent valid categorical levels for standardized terminology mapping. Instead, they
      // are included in Annotations.MissingValues.
      .filter(([levelValue]) => !missingValues.includes(levelValue))
      .map(([levelValue, levelData]) => {
        const term = standardizedTerms[levelData.standardizedTerm];
        return [
          levelValue,
          term?.id && term.label
            ? { TermURL: term.id, Label: term.label }
            : ({} as { TermURL: string; Label: string }),
        ];
      })
  );

/**
 * Constructs a DataDictionary entry for a single column.
 *
 * Transforms the internal column representation into the BIDS-compliant
 * neurobagel data dictionary format. It maps metadata (description,
 * units, categorical levels) and populates semantic annotations (IsAbout, IsPartOf,
 * term URIs, missing values, and calculated value ranges for continuous variables like age).
 *
 * @param column - The internal column object to process.
 * @param standardizedVariables - Map of all available standardized variables.
 * @param standardizedTerms - Map of all available standardized terms.
 * @param standardizedFormats - Map of all available standardized formats.
 * @returns A formatted data dictionary entry representing the column's annotations.
 */
export function buildColumnEntry(
  column: Column,
  standardizedVariables: ReturnType<typeof useStandardizedVariables>,
  standardizedTerms: StandardizedTerms,
  standardizedFormats: ReturnType<typeof useStandardizedFormats>
): DataDictionary[string] {
  const entry: DataDictionary[string] = {
    Description: column.description ?? '',
  };

  if (column.dataType === DataType.categorical && column.levels) {
    entry.Levels = buildColumnLevelsDictionary(column.levels);
  }

  if (column.dataType === DataType.continuous && column.units !== undefined) {
    entry.Units = column.units ?? '';
  }

  if (column.standardizedVariable) {
    const standardizedVariable = standardizedVariables[column.standardizedVariable];
    const resolvedVariableType =
      standardizedVariable?.variable_type ?? mapDataTypeToVariableType(column.dataType);

    entry.Annotations = {
      IsAbout: {
        TermURL: standardizedVariable?.id ?? column.standardizedVariable,
        Label: standardizedVariable?.name ?? column.standardizedVariable,
      },
      VariableType: resolvedVariableType,
    };

    if (
      column.dataType === DataType.categorical &&
      column.levels &&
      resolvedVariableType !== VariableType.collection
    ) {
      entry.Annotations.Levels = buildAnnotationLevelsDictionary(
        column.levels,
        standardizedTerms,
        column.missingValues
      );
    }

    if (column.isPartOf) {
      const partOfTerm = standardizedTerms[column.isPartOf];
      if (partOfTerm) {
        entry.Annotations.IsPartOf = {
          TermURL: partOfTerm.id,
          Label: partOfTerm.label,
        };
      }
    }

    if (column.missingValues && column.missingValues.length > 0) {
      entry.Annotations.MissingValues = column.missingValues;
    }

    if (column.dataType === DataType.continuous && column.format) {
      const format = standardizedFormats[column.format];
      if (format) {
        entry.Annotations.Format = {
          TermURL: format.identifier,
          Label: format.label,
        };
      }
    }

    // Compute min/max for Age columns
    if (column.dataType === DataType.continuous && standardizedVariable?.name === 'Age') {
      const uniqueValues = Array.from(new Set(column.allValues ?? []));
      const validationResult = validateContinuousValues(
        uniqueValues,
        column.missingValues ?? [],
        column.format
      );

      if (
        validationResult &&
        validationResult.invalidCount === 0 &&
        validationResult.min !== null &&
        validationResult.max !== null
      ) {
        entry.Annotations.ValueRange = {
          Min: validationResult.min,
          Max: validationResult.max,
        };
      }
    }
  }

  return entry;
}

export function useGenerateDataDictionary(): DataDictionary {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();
  const standardizedTerms = useStandardizedTerms();
  const standardizedFormats = useStandardizedFormats();

  return useMemo(
    () =>
      Object.fromEntries(
        Object.values(columns)
          .filter((column) => column?.name)
          .map((column) => [
            column.name,
            buildColumnEntry(column, standardizedVariables, standardizedTerms, standardizedFormats),
          ])
      ),
    [columns, standardizedFormats, standardizedTerms, standardizedVariables]
  );
}

export default useGenerateDataDictionary;
