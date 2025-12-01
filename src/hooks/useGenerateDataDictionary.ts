import { useMemo } from 'react';
import {
  useColumns,
  useStandardizedFormats,
  useStandardizedTerms,
  useStandardizedVariables,
} from '../stores/data';
import {
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
  Object.entries(levels ?? {}).reduce<DataDictionaryLevels>(
    (acc, [levelValue, levelData]) => ({
      ...acc,
      [levelValue]: {
        Description: levelData.description ?? '',
        ...(levelData.standardizedTerm ? { TermURL: levelData.standardizedTerm } : {}),
      },
    }),
    {}
  );

const buildAnnotationLevelsDictionary = (
  levels: ColumnLevels | null | undefined,
  standardizedTerms: StandardizedTerms
): AnnotationLevels =>
  Object.entries(levels ?? {}).reduce<AnnotationLevels>((acc, [levelValue, levelData]) => {
    const term = standardizedTerms[levelData.standardizedTerm];
    return {
      ...acc,
      [levelValue]:
        term?.id && term.label
          ? { TermURL: term.id, Label: term.label }
          : ({} as { TermURL: string; Label: string }),
    };
  }, {});

export function useGenerateDataDictionary(): DataDictionary {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();
  const standardizedTerms = useStandardizedTerms();
  const standardizedFormats = useStandardizedFormats();

  return useMemo(
    () =>
      Object.values(columns).reduce<DataDictionary>((dictionary, column) => {
        if (!column?.name) {
          return dictionary;
        }

        const key = column.name;
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
              standardizedTerms
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
        }

        return {
          ...dictionary,
          [key]: entry,
        };
      }, {}),
    [columns, standardizedFormats, standardizedTerms, standardizedVariables]
  );
}

export default useGenerateDataDictionary;
