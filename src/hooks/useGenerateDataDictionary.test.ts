import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useColumns,
  useStandardizedFormats,
  useStandardizedTerms,
  useStandardizedVariables,
} from '../stores/data';
import { DataType, VariableType } from '../utils/internal_types';
import { mockDataDictionaryWithAnnotations } from '../utils/mocks';
import { useGenerateDataDictionary } from './useGenerateDataDictionary';

vi.mock('../stores/data', () => ({
  useColumns: vi.fn(),
  useStandardizedVariables: vi.fn(),
  useStandardizedTerms: vi.fn(),
  useStandardizedFormats: vi.fn(),
}));

const mockedUseColumns = vi.mocked(useColumns);
const mockedUseStandardizedVariables = vi.mocked(useStandardizedVariables);
const mockedUseStandardizedTerms = vi.mocked(useStandardizedTerms);
const mockedUseStandardizedFormats = vi.mocked(useStandardizedFormats);

describe('useGenerateDataDictionary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseStandardizedVariables.mockReturnValue({});
    mockedUseStandardizedTerms.mockReturnValue({});
    mockedUseStandardizedFormats.mockReturnValue({});
  });

  it('should build dictionary entries for categorical columns with levels annotations', () => {
    mockedUseColumns.mockReturnValue({
      '1': {
        id: '1',
        name: 'sex',
        allValues: [],
        description: 'Sex of participant',
        dataType: DataType.categorical,
        levels: {
          M: { description: 'Male', standardizedTerm: 'term:male' },
          F: { description: 'Female', standardizedTerm: 'term:female' },
        },
        standardizedVariable: 'nb:Sex',
        missingValues: ['Unknown'],
      },
    });

    mockedUseStandardizedVariables.mockReturnValue({
      'nb:Sex': {
        id: 'nb:Sex',
        name: 'Sex',
      },
    });

    mockedUseStandardizedTerms.mockReturnValue({
      'term:male': {
        id: 'term:male',
        label: 'Male',
        standardizedVariableId: 'nb:Sex',
      },
      'term:female': {
        id: 'term:female',
        label: 'Female',
        standardizedVariableId: 'nb:Sex',
      },
    });

    const { result } = renderHook(() => useGenerateDataDictionary());
    const entry = result.current.sex;

    expect(entry.Description).toBe('Sex of participant');
    expect(entry.Levels).toEqual({
      M: { Description: 'Male', TermURL: 'term:male' },
      F: { Description: 'Female', TermURL: 'term:female' },
    });
    expect(entry.Annotations).toEqual({
      IsAbout: { TermURL: 'nb:Sex', Label: 'Sex' },
      VariableType: VariableType.categorical,
      Levels: {
        M: { TermURL: 'term:male', Label: 'Male' },
        F: { TermURL: 'term:female', Label: 'Female' },
      },
      MissingValues: ['Unknown'],
    });
  });

  it('should build dictionary entries for continuous columns with units and formats', () => {
    mockedUseColumns.mockReturnValue({
      '2': {
        id: '2',
        name: 'age',
        allValues: [],
        description: 'Age in years',
        dataType: DataType.continuous,
        units: 'years',
        format: 'nb:FromFloat',
        standardizedVariable: 'nb:Age',
      },
    });

    mockedUseStandardizedVariables.mockReturnValue({
      'nb:Age': {
        id: 'nb:Age',
        name: 'Age',
      },
    });

    mockedUseStandardizedFormats.mockReturnValue({
      'nb:FromFloat': {
        standardizedVariableId: 'nb:Age',
        identifier: 'nb:FromFloat',
        label: 'float',
      },
    });

    const { result } = renderHook(() => useGenerateDataDictionary());
    const entry = result.current.age;

    expect(entry.Units).toBe('years');
    expect(entry.Annotations).toEqual({
      IsAbout: { TermURL: 'nb:Age', Label: 'Age' },
      VariableType: VariableType.continuous,
      Format: { TermURL: 'nb:FromFloat', Label: 'float' },
    });
  });

  it('should build dictionary entries for multi-column measure columns with units and isPartOf', () => {
    mockedUseColumns.mockReturnValue({
      '5': {
        id: '5',
        name: 'assessment_score',
        allValues: [],
        dataType: DataType.continuous,
        units: 'points',
        standardizedVariable: 'nb:Assessment',
        isPartOf: 'term:collection',
      },
    });

    mockedUseStandardizedVariables.mockReturnValue({
      'nb:Assessment': {
        id: 'nb:Assessment',
        name: 'Assessment Tool',
        variable_type: VariableType.collection,
        is_multi_column_measure: true,
      },
    });

    mockedUseStandardizedTerms.mockReturnValue({
      'term:collection': {
        id: 'term:collection',
        label: 'Subscale A',
        standardizedVariableId: 'nb:Assessment',
      },
    });

    const { result } = renderHook(() => useGenerateDataDictionary());
    const entry = result.current.assessment_score;

    expect(entry.Units).toBe('points');
    expect(entry.Annotations).toEqual({
      IsAbout: { TermURL: 'nb:Assessment', Label: 'Assessment Tool' },
      VariableType: VariableType.collection,
      IsPartOf: { TermURL: 'term:collection', Label: 'Subscale A' },
    });
  });

  it('should emit empty annotation levels when standardized terms are missing', () => {
    mockedUseColumns.mockReturnValue({
      '6': {
        id: '6',
        name: 'response',
        allValues: [],
        dataType: DataType.categorical,
        standardizedVariable: 'nb:Response',
        levels: {
          Yes: { description: 'Affirmative', standardizedTerm: 'term:yes' },
          No: { description: 'Negative', standardizedTerm: 'term:no' },
        },
      },
    });

    mockedUseStandardizedVariables.mockReturnValue({
      'nb:Response': {
        id: 'nb:Response',
        name: 'Response',
      },
    });

    mockedUseStandardizedTerms.mockReturnValue({});

    const { result } = renderHook(() => useGenerateDataDictionary());
    const entry = result.current.response;

    expect(entry.Levels).toEqual({
      Yes: { Description: 'Affirmative', TermURL: 'term:yes' },
      No: { Description: 'Negative', TermURL: 'term:no' },
    });
    expect(entry.Annotations?.Levels).toEqual({
      Yes: {},
      No: {},
    });
  });

  it('should prefer standardized variable type when both variable type and data type are present', () => {
    mockedUseColumns.mockReturnValue({
      '3': {
        id: '3',
        name: 'participant_id',
        allValues: [],
        dataType: DataType.categorical,
        standardizedVariable: 'nb:ParticipantID',
      },
    });
    mockedUseStandardizedVariables.mockReturnValue({
      'nb:ParticipantID': {
        id: 'nb:ParticipantID',
        name: 'Participant ID',
        variable_type: VariableType.identifier,
      },
    });

    const { result } = renderHook(() => useGenerateDataDictionary());
    const entry = result.current.participant_id;

    expect(entry.Annotations?.VariableType).toBe(VariableType.identifier);
  });

  it('should fall back to column data type when standardized variable type is missing', () => {
    mockedUseColumns.mockReturnValue({
      '4': {
        id: '4',
        name: 'assessment_score',
        allValues: [],
        dataType: DataType.continuous,
        standardizedVariable: 'nb:Assessment',
      },
    });
    mockedUseStandardizedVariables.mockReturnValue({
      'nb:Assessment': {
        id: 'nb:Assessment',
        name: 'Assessment Tool',
      },
    });

    const { result } = renderHook(() => useGenerateDataDictionary());
    const entry = result.current.assessment_score;

    expect(entry.Annotations?.VariableType).toBe(VariableType.continuous);
  });
  it('should match legacy getDataDictionary output for a fully annotated dataset', () => {
    mockedUseColumns.mockReturnValue({
      '1': {
        id: '1',
        name: 'participant_id',
        allValues: [],
        description: 'A participant ID',
        dataType: DataType.categorical,
        standardizedVariable: 'nb:ParticipantID',
      },
      '2': {
        id: '2',
        name: 'age',
        allValues: [],
        description: 'Age of the participant',
        dataType: DataType.continuous,
        standardizedVariable: 'nb:Age',
        units: '',
        format: 'nb:FromFloat',
      },
      '3': {
        id: '3',
        name: 'sex',
        allValues: [],
        description: 'Sex of the participant',
        dataType: DataType.categorical,
        standardizedVariable: 'nb:Sex',
        levels: {
          M: { description: 'Male', standardizedTerm: 'snomed:248153007' },
          F: { description: 'Female', standardizedTerm: 'snomed:248152002' },
        },
        missingValues: ['N/A'],
      },
      '4': {
        id: '4',
        name: 'group_dx',
        allValues: [],
        description: 'Diagnosis of the participant',
        dataType: DataType.categorical,
        standardizedVariable: 'nb:Diagnosis',
        levels: {
          ADHD: {
            description: 'Attention deficit hyperactivity disorder',
            standardizedTerm: 'snomed:406506008',
          },
          PD: { description: 'Parkinsons', standardizedTerm: 'snomed:870288002' },
        },
      },
      '5': {
        id: '5',
        name: 'group',
        allValues: [],
        description: 'The group assignment of the participant in a study.',
        dataType: DataType.categorical,
        standardizedVariable: 'nb:Diagnosis',
        levels: {
          HC: { description: 'Healthy control', standardizedTerm: 'ncit:C94342' },
        },
        missingValues: ['Patient', 'N/A'],
      },
      '6': {
        id: '6',
        name: 'iq',
        allValues: [],
        description: 'iq test score of the participant',
        dataType: DataType.continuous,
        standardizedVariable: 'nb:Assessment',
        isPartOf: 'snomed:273712001',
      },
    });

    mockedUseStandardizedVariables.mockReturnValue({
      'nb:ParticipantID': {
        id: 'nb:ParticipantID',
        name: 'Participant ID',
        variable_type: VariableType.identifier,
      },
      'nb:Age': {
        id: 'nb:Age',
        name: 'Age',
        variable_type: VariableType.continuous,
      },
      'nb:Sex': {
        id: 'nb:Sex',
        name: 'Sex',
        variable_type: VariableType.categorical,
      },
      'nb:Diagnosis': {
        id: 'nb:Diagnosis',
        name: 'Diagnosis',
        variable_type: VariableType.categorical,
      },
      'nb:Assessment': {
        id: 'nb:Assessment',
        name: 'Assessment Tool',
        variable_type: VariableType.collection,
        is_multi_column_measure: true,
      },
    });

    mockedUseStandardizedTerms.mockReturnValue({
      'snomed:248153007': {
        id: 'snomed:248153007',
        label: 'Male',
        standardizedVariableId: 'nb:Sex',
      },
      'snomed:248152002': {
        id: 'snomed:248152002',
        label: 'Female',
        standardizedVariableId: 'nb:Sex',
      },
      'snomed:406506008': {
        id: 'snomed:406506008',
        label: 'Attention deficit hyperactivity disorder',
        standardizedVariableId: 'nb:Diagnosis',
      },
      'snomed:870288002': {
        id: 'snomed:870288002',
        label: 'Parkinsonism caused by methanol',
        standardizedVariableId: 'nb:Diagnosis',
      },
      'ncit:C94342': {
        id: 'ncit:C94342',
        label: 'Healthy Control',
        standardizedVariableId: 'nb:Diagnosis',
      },
      'snomed:273712001': {
        id: 'snomed:273712001',
        label: 'Previous IQ assessment by pronunciation',
        standardizedVariableId: 'nb:Assessment',
      },
    });

    mockedUseStandardizedFormats.mockReturnValue({
      'nb:FromFloat': {
        standardizedVariableId: 'nb:Age',
        identifier: 'nb:FromFloat',
        label: 'float',
      },
    });

    const { result } = renderHook(() => useGenerateDataDictionary());
    expect(result.current).toEqual(mockDataDictionaryWithAnnotations);
  });
});
