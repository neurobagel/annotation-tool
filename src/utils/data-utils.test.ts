import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';
import mockDataDictionaryRaw from '../../cypress/fixtures/examples/mock.json?raw';
import mockTsvRaw from '../../cypress/fixtures/examples/mock.tsv?raw';
import mockTsvWithEmptyLineRaw from '../../cypress/fixtures/examples/mock_with_empty_line.tsv?raw';
import { Columns, DataDictionary, StandardizedVariables, DataType } from '../../internal_types';
import { fetchConfigGitHubURL, githubRawBaseURL } from './constants';
import {
  fetchAvailableConfigs,
  fetchConfig,
  convertStandardizedVariables,
  convertStandardizedTerms,
  convertStandardizedFormats,
  readFile,
  parseTsvContent,
  applyDataDictionaryToColumns,
  applyDataTypeToColumn,
} from './data-utils';
import {
  mockGitHubResponse,
  mockTermsData,
  mockConfigFile,
  mockStandardizedVariables,
  mockStandardizedTerms,
  mockStandardizedFormats,
  mockColumnsAfterDataTableUpload,
} from './mocks';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('fetchAvailableConfigs', () => {
  it('should fetch available configs from the right GitHub location and handles the (mock) response', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockGitHubResponse });

    const result = await fetchAvailableConfigs();

    expect(mockedAxios.get).toHaveBeenCalledWith(fetchConfigGitHubURL);
    expect(result).toEqual(['Neurobagel', 'OtherConfig', 'TestConfig']);
  });

  it('should return default config when GitHub API fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchAvailableConfigs();

    expect(mockedAxios.get).toHaveBeenCalledWith(fetchConfigGitHubURL);
    expect(result).toEqual(['Neurobagel']);
  });

  it('should filter out non-directory items', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockGitHubResponse });

    const result = await fetchAvailableConfigs();

    expect(result).toEqual(['Neurobagel', 'OtherConfig', 'TestConfig']);
    expect(result).not.toContain('README.md');
    expect(result).not.toContain('config.json');
  });
});

describe('fetchConfig', () => {
  it('should fetch config from remote GitHub successfully', async () => {
    const configArray = [mockConfigFile];

    mockedAxios.get
      .mockResolvedValueOnce({ data: configArray })
      .mockResolvedValueOnce({ data: mockTermsData['sex.json'] })
      .mockResolvedValueOnce({ data: mockTermsData['diagnosis.json'] })
      .mockResolvedValueOnce({ data: mockTermsData['assessment.json'] });

    const result = await fetchConfig('Neurobagel');

    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/config.json`);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/sex.json`);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/diagnosis.json`);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/assessment.json`);
    expect(result.config).toEqual(mockConfigFile);
    expect(result.termsData).toEqual(mockTermsData);
  });

  it('should fallback to default config when remote fails', async () => {
    mockedAxios.get.mockReset();
    mockedAxios.get.mockRejectedValueOnce(new Error('Remote config not found'));

    const result = await fetchConfig('Neurobagel');

    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/config.json`);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(result.config).toBeDefined();
    expect(result.termsData).toBeDefined();
  });

  it('should return empty config when both remote and default fail', async () => {
    mockedAxios.get.mockReset();
    mockedAxios.get.mockRejectedValueOnce(new Error('Remote config not found'));

    const result = await fetchConfig('Neurobagel');

    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/config.json`);
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(result.config).toBeDefined();
    expect(result.termsData).toBeDefined();
  });

  it('should handle different config names', async () => {
    const configArray = [mockConfigFile];

    mockedAxios.get
      .mockResolvedValueOnce({ data: configArray })
      .mockResolvedValueOnce({ data: mockTermsData['sex.json'] })
      .mockResolvedValueOnce({ data: mockTermsData['diagnosis.json'] })
      .mockResolvedValueOnce({ data: mockTermsData['assessment.json'] });

    const result = await fetchConfig('TestConfig');

    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}TestConfig/config.json`);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}TestConfig/sex.json`);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}TestConfig/diagnosis.json`);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}TestConfig/assessment.json`);
    expect(result.config).toEqual(mockConfigFile);
    expect(result.termsData).toEqual(mockTermsData);
  });

  it('should handle config with multiple terms files', async () => {
    const configArray = [mockConfigFile];

    mockedAxios.get
      .mockResolvedValueOnce({ data: configArray })
      .mockResolvedValueOnce({ data: mockTermsData['sex.json'] })
      .mockResolvedValueOnce({ data: mockTermsData['diagnosis.json'] })
      .mockResolvedValueOnce({ data: mockTermsData['assessment.json'] });

    const result = await fetchConfig('Neurobagel');

    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/config.json`);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/sex.json`);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/diagnosis.json`);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/assessment.json`);
    expect(result.config).toEqual(mockConfigFile);
    expect(result.termsData).toEqual(mockTermsData);
  });

  it('should handle file loading errors gracefully', async () => {
    const configArray = [mockConfigFile];

    mockedAxios.get
      .mockResolvedValueOnce({ data: configArray })
      .mockRejectedValueOnce(new Error('Terms file not found')) // sex.json fails
      .mockResolvedValueOnce({ data: mockTermsData['diagnosis.json'] })
      .mockResolvedValueOnce({ data: mockTermsData['assessment.json'] });

    const result = await fetchConfig('Neurobagel');

    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/config.json`);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/sex.json`);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/diagnosis.json`);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${githubRawBaseURL}Neurobagel/assessment.json`);
    expect(result.config).toEqual(mockConfigFile);
    expect(result.termsData).toEqual({
      'sex.json': [],
      'diagnosis.json': mockTermsData['diagnosis.json'],
      'assessment.json': mockTermsData['assessment.json'],
    });
  });
});

describe('convertStandardizedVariables', () => {
  it('should convert standardized variables config array to StandardizedVariables object', () => {
    const result = convertStandardizedVariables(
      mockConfigFile.standardized_variables,
      mockConfigFile.namespace_prefix
    );

    expect(result).toBeDefined();
    expect(Object.keys(result)).toHaveLength(6);
    expect(result['nb:ParticipantID']).toBeDefined();
    expect(result['nb:Age']).toBeDefined();
  });

  it("should correctly map a standardized variable's properties", () => {
    const result = convertStandardizedVariables(
      mockConfigFile.standardized_variables,
      mockConfigFile.namespace_prefix
    );

    const ageVariable = result['nb:Age'];
    expect(ageVariable.id).toBe('nb:Age');
    expect(ageVariable.name).toBe('Age');
    expect(ageVariable.variable_type).toBe('Continuous');
    expect(ageVariable.description).toBe('The age of the participant.');
    expect(ageVariable.required).toBe(false);
  });
});

describe('convertStandardizedTerms', () => {
  it('should correctly convert termsData to StandardizedTerms object', () => {
    const result = convertStandardizedTerms(
      mockTermsData,
      mockConfigFile.standardized_variables,
      mockConfigFile.namespace_prefix
    );

    expect(result).toBeDefined();
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  it("should correctly map a standardized variable's terms", () => {
    const result = convertStandardizedTerms(
      mockTermsData,
      mockConfigFile.standardized_variables,
      mockConfigFile.namespace_prefix
    );

    const adhdTerm = result['snomed:406506008'];
    expect(adhdTerm).toBeDefined();
    expect(adhdTerm.id).toBe('snomed:406506008');
    expect(adhdTerm.label).toBe('Attention deficit hyperactivity disorder');
    expect(adhdTerm.standardizedVariableId).toBe('nb:Diagnosis');
    expect(adhdTerm.isCollection).toBe(false);
  });
});

describe('convertStandardizedFormats', () => {
  it('should convert formats to StandardizedFormats object', () => {
    const result = convertStandardizedFormats(
      mockConfigFile.standardized_variables,
      mockConfigFile.namespace_prefix
    );

    expect(result).toBeDefined();
    expect(Object.keys(result)).toHaveLength(5);
  });

  it('should correctly map a format', () => {
    const result = convertStandardizedFormats(
      mockConfigFile.standardized_variables,
      mockConfigFile.namespace_prefix
    );

    const floatFormat = result['nb:FromFloat'];
    expect(floatFormat).toBeDefined();
    expect(floatFormat.identifier).toBe('nb:FromFloat');
    expect(floatFormat.label).toBe('float');
    expect(floatFormat.standardizedVariableId).toBe('nb:Age');
    expect(floatFormat.examples).toEqual(['31.5']);
  });

  it('should map all age formats', () => {
    const result = convertStandardizedFormats(
      mockConfigFile.standardized_variables,
      mockConfigFile.namespace_prefix
    );

    expect(result['nb:FromFloat']).toBeDefined();
    expect(result['nb:FromEuro']).toBeDefined();
    expect(result['nb:FromBounded']).toBeDefined();
    expect(result['nb:FromRange']).toBeDefined();
    expect(result['nb:FromISO8601']).toBeDefined();
  });
});

describe('readFile + parseTsvContent integration', () => {
  it('should read and parse a valid TSV file correctly', async () => {
    const file = new File([mockTsvRaw], 'mock.tsv', { type: 'text/tab-separated-values' });

    const content = await readFile(file);
    const { headers, data } = parseTsvContent(content);

    expect(headers).toEqual(['participant_id', 'age', 'sex', 'group_dx', 'group', 'iq']);
    expect(data).toHaveLength(12);
    expect(data[0]).toEqual(['sub-718211', '28.4', 'M', 'ADHD', 'HC', '80']);
    expect(data[11]).toEqual(['sub-718225', '65', 'N/A', 'PD', 'HC', '83']);
  });

  it('should handle an empty TSV file', async () => {
    const file = new File([''], 'empty.tsv', { type: 'text/tab-separated-values' });

    const content = await readFile(file);
    const { headers, data } = parseTsvContent(content);

    expect(headers).toEqual([]);
    expect(data).toEqual([]);
  });

  it('should handle a TSV file with only headers', async () => {
    const tsvContent = 'col1\tcol2\tcol3';
    const file = new File([tsvContent], 'headers-only.tsv', { type: 'text/tab-separated-values' });

    const content = await readFile(file);
    const { headers, data } = parseTsvContent(content);

    expect(headers).toEqual(['col1', 'col2', 'col3']);
    expect(data).toEqual([]);
  });

  it('should handle a TSV file with empty values', async () => {
    const tsvContent = 'col1\tcol2\tcol3\nval1\t\tval3\n\tval2\t';
    const file = new File([tsvContent], 'empty-values.tsv', { type: 'text/tab-separated-values' });

    const content = await readFile(file);
    const { headers, data } = parseTsvContent(content);

    expect(headers).toEqual(['col1', 'col2', 'col3']);
    expect(data).toHaveLength(2);
    expect(data[0]).toEqual(['val1', '', 'val3']);
    expect(data[1]).toEqual(['', 'val2', '']);
  });

  it('should skip empty lines in a TSV file', async () => {
    const file = new File([mockTsvWithEmptyLineRaw], 'mock_with_empty_line.tsv', {
      type: 'text/tab-separated-values',
    });

    const content = await readFile(file);
    const { headers, data } = parseTsvContent(content);

    expect(headers).toEqual(['participant_id', 'age', 'sex', 'group_dx', 'iq']);
    expect(data).toHaveLength(12);
    expect(data[0]).toEqual(['sub-718211', '28.4', 'M', 'ADHD', '80']);
    expect(data[11]).toEqual(['sub-718225', '65', 'N/A', 'PD', '83']);
  });
});

describe('applyDataDictionaryToColumns', () => {
  it('should apply data dictionary from mock.json to columns and return updated columns', () => {
    const mockDataDict = JSON.parse(mockDataDictionaryRaw);

    const result = applyDataDictionaryToColumns(
      mockColumnsAfterDataTableUpload,
      mockDataDict,
      mockStandardizedVariables,
      mockStandardizedTerms,
      mockStandardizedFormats
    );

    expect(result['0'].description).toBe('A participant ID');
    expect(result['0'].standardizedVariable).toBe('nb:ParticipantID');
    // Identifier VariableType doesn't map to DataType
    expect(result['0'].dataType).toBeUndefined();

    expect(result['1'].description).toBe('Age of the participant');
    expect(result['1'].standardizedVariable).toBe('nb:Age');
    expect(result['1'].dataType).toBe('Continuous');
    expect(result['1'].format).toBe('nb:FromFloat');

    expect(result['2'].description).toBe('Sex of the participant');
    expect(result['2'].standardizedVariable).toBe('nb:Sex');
    expect(result['2'].dataType).toBe('Categorical');
    expect(result['2'].levels).toBeDefined();
    expect(result['2'].levels?.M.description).toBe('Male');
    expect(result['2'].levels?.M.standardizedTerm).toBe('snomed:248153007');
    expect(result['2'].levels?.F.description).toBe('Female');
    expect(result['2'].levels?.F.standardizedTerm).toBe('snomed:248152002');
    expect(result['2'].missingValues).toEqual(['N/A']);

    expect(result['3'].description).toBe('Diagnosis of the participant');
    expect(result['3'].standardizedVariable).toBe('nb:Diagnosis');
    expect(result['3'].dataType).toBe('Categorical');

    expect(result['5'].description).toBe('iq test score of the participant');
    expect(result['5'].standardizedVariable).toBe('nb:Assessment');
    // Collection VariableType doesn't map to DataType
    expect(result['5'].dataType).toBeUndefined();
    expect(result['5'].isPartOf).toBe('snomed:273712001');
  });

  it('should handle categorical variables with levels', () => {
    const mockColumns = {
      '0': {
        id: '0',
        name: 'sex',
        allValues: ['M', 'F'],
      },
    };

    const mockDataDict = {
      sex: {
        Description: 'Sex of the participant',
        Levels: {
          M: {
            Description: 'Male',
          },
          F: {
            Description: 'Female',
          },
        },
        Annotations: {
          IsAbout: {
            TermURL: 'nb:Sex',
            Label: 'Sex',
          },
          VariableType: 'Categorical' as const,
          Levels: {
            M: {
              TermURL: 'snomed:248153007',
              Label: 'Male',
            },
            F: {
              TermURL: 'snomed:248152002',
              Label: 'Female',
            },
          },
          MissingValues: ['N/A'],
        },
      },
    };

    const result = applyDataDictionaryToColumns(
      mockColumns as unknown as Columns,
      mockDataDict as unknown as DataDictionary,
      mockStandardizedVariables as unknown as StandardizedVariables,
      mockStandardizedTerms,
      mockStandardizedFormats
    );

    expect(result['0'].description).toBe('Sex of the participant');
    expect(result['0'].standardizedVariable).toBe('nb:Sex');
    expect(result['0'].dataType).toBe('Categorical');
    expect(result['0'].levels).toBeDefined();
    expect(result['0'].levels?.M.description).toBe('Male');
    expect(result['0'].levels?.M.standardizedTerm).toBe('snomed:248153007');
    expect(result['0'].levels?.F.description).toBe('Female');
    expect(result['0'].levels?.F.standardizedTerm).toBe('snomed:248152002');
    expect(result['0'].missingValues).toEqual(['N/A']);
  });

  it('should handle multi-column measures with IsPartOf', () => {
    const mockColumns = {
      '0': {
        id: '0',
        name: 'iq',
        allValues: ['100', '110'],
      },
    };

    const mockDataDict = {
      iq: {
        Description: 'IQ test score',
        Annotations: {
          IsAbout: {
            TermURL: 'nb:Assessment',
            Label: 'Assessment Tool',
          },
          VariableType: 'Collection' as const,
          IsPartOf: {
            TermURL: 'snomed:273712001',
            Label: 'Previous IQ assessment by pronunciation',
          },
        },
      },
    };

    const result = applyDataDictionaryToColumns(
      mockColumns as unknown as Columns,
      mockDataDict as unknown as DataDictionary,
      mockStandardizedVariables as unknown as StandardizedVariables,
      mockStandardizedTerms,
      mockStandardizedFormats
    );

    expect(result['0'].description).toBe('IQ test score');
    expect(result['0'].standardizedVariable).toBe('nb:Assessment');
    expect(result['0'].isPartOf).toBe('snomed:273712001');
  });

  it('should handle formats for continuous variables', () => {
    const mockColumns = {
      '0': {
        id: '0',
        name: 'age',
        allValues: ['25.5', '30.2'],
      },
    };

    const mockDataDict = {
      age: {
        Description: 'Age of the participant',
        Annotations: {
          IsAbout: {
            TermURL: 'nb:Age',
            Label: 'Age',
          },
          VariableType: 'Continuous' as const,
          Format: {
            TermURL: 'nb:FromFloat',
            Label: 'float',
          },
        },
        Units: 'years',
      },
    };

    const result = applyDataDictionaryToColumns(
      mockColumns as unknown as Columns,
      mockDataDict as unknown as DataDictionary,
      mockStandardizedVariables as unknown as StandardizedVariables,
      mockStandardizedTerms,
      mockStandardizedFormats
    );

    expect(result['0'].format).toBe('nb:FromFloat');
    expect(result['0'].dataType).toBe('Continuous');
    expect(result['0'].units).toBe('years');
  });

  it('should not modify columns when column names do not match', () => {
    const mockColumns = {
      '0': {
        id: '0',
        name: 'column1',
        allValues: ['val1', 'val2'],
      },
    };

    const mockDataDict = {
      different_column: {
        Description: 'Some description',
        Annotations: {
          IsAbout: {
            TermURL: 'nb:Age',
            Label: 'Age',
          },
        },
      },
    };

    const result = applyDataDictionaryToColumns(
      mockColumns,
      mockDataDict,
      mockStandardizedVariables,
      mockStandardizedTerms,
      mockStandardizedFormats
    );

    expect(result['0'].description).toBeUndefined();
    expect(result['0'].standardizedVariable).toBeUndefined();
  });

  it('should skip invalid standardized variable references', () => {
    const mockColumns = {
      '0': {
        id: '0',
        name: 'test_column',
        allValues: ['val1', 'val2'],
      },
    };

    const mockDataDict = {
      test_column: {
        Description: 'Test column',
        Annotations: {
          IsAbout: {
            TermURL: 'nb:NonExistentVariable',
            Label: 'Non Existent',
          },
        },
      },
    };

    const result = applyDataDictionaryToColumns(
      mockColumns,
      mockDataDict,
      mockStandardizedVariables,
      mockStandardizedTerms,
      mockStandardizedFormats
    );

    expect(result['0'].description).toBe('Test column');
    expect(result['0'].standardizedVariable).toBeUndefined();
  });

  it('should skip invalid term references in IsPartOf', () => {
    const mockColumns = {
      '0': {
        id: '0',
        name: 'test_column',
        allValues: ['val1', 'val2'],
      },
    };

    const mockDataDict = {
      test_column: {
        Description: 'Test column',
        Annotations: {
          IsAbout: {
            TermURL: 'nb:Assessment',
            Label: 'Assessment Tool',
          },
          IsPartOf: {
            TermURL: 'snomed:NonExistentTerm',
            Label: 'Non Existent Term',
          },
        },
      },
    };

    const result = applyDataDictionaryToColumns(
      mockColumns,
      mockDataDict,
      mockStandardizedVariables,
      mockStandardizedTerms,
      mockStandardizedFormats
    );

    expect(result['0'].standardizedVariable).toBe('nb:Assessment');
    expect(result['0'].isPartOf).toBeUndefined();
  });

  it('should skip invalid format references', () => {
    const mockColumns = {
      '0': {
        id: '0',
        name: 'age',
        allValues: ['25', '30'],
      },
    };

    const mockDataDict = {
      age: {
        Description: 'Age',
        Annotations: {
          IsAbout: {
            TermURL: 'nb:Age',
            Label: 'Age',
          },
          Format: {
            TermURL: 'nb:NonExistentFormat',
            Label: 'Non Existent',
          },
        },
      },
    };

    const result = applyDataDictionaryToColumns(
      mockColumns,
      mockDataDict,
      mockStandardizedVariables,
      mockStandardizedTerms,
      mockStandardizedFormats
    );

    expect(result['0'].standardizedVariable).toBe('nb:Age');
    expect(result['0'].format).toBeUndefined();
  });

  it('should handle levels without term annotations', () => {
    const mockColumns = {
      '0': {
        id: '0',
        name: 'category',
        allValues: ['A', 'B'],
      },
    };

    const mockDataDict = {
      category: {
        Description: 'Category column',
        Levels: {
          A: {
            Description: 'Category A',
          },
          B: {
            Description: 'Category B',
          },
        },
        Annotations: {
          IsAbout: {
            TermURL: 'nb:Diagnosis',
            Label: 'Diagnosis',
          },
          VariableType: 'Categorical' as const,
        },
      },
    };

    const result = applyDataDictionaryToColumns(
      mockColumns as unknown as Columns,
      mockDataDict as unknown as DataDictionary,
      mockStandardizedVariables as unknown as StandardizedVariables,
      mockStandardizedTerms,
      mockStandardizedFormats
    );

    expect(result['0'].levels).toBeDefined();
    expect(result['0'].levels?.A.description).toBe('Category A');
    expect(result['0'].levels?.A.standardizedTerm).toBe('');
    expect(result['0'].levels?.B.description).toBe('Category B');
    expect(result['0'].levels?.B.standardizedTerm).toBe('');
  });

  it('should return a new columns object without mutating the original', () => {
    const mockColumns = {
      '0': {
        id: '0',
        name: 'test',
        allValues: ['val1'],
      },
    };

    const mockDataDict = {
      test: {
        Description: 'Test description',
      },
    };

    const result = applyDataDictionaryToColumns(
      mockColumns as unknown as Columns,
      mockDataDict as unknown as DataDictionary,
      mockStandardizedVariables as unknown as StandardizedVariables,
      mockStandardizedTerms,
      mockStandardizedFormats
    );

    expect(result).not.toBe(mockColumns);
    expect((mockColumns as Columns)['0'].description).toBeUndefined();
    expect(result['0'].description).toBe('Test description');
  });
});

describe('applyDataTypeToColumn', () => {
  const createColumn = (
    overrides: {
      dataType?: DataType | null;
      levels?: { [key: string]: { description: string; standardizedTerm: string } } | null;
      units?: string;
    } = {}
  ) => ({
    dataType: undefined,
    levels: undefined,
    units: undefined,
    ...overrides,
  });

  it('should set dataType to categorical and initialize levels from allValues', () => {
    const column = createColumn();
    const allValues = ['A', 'B', 'A', 'C', 'B'];

    const result = applyDataTypeToColumn(column, DataType.categorical, allValues);

    expect(result).not.toBe(column);
    expect(result.dataType).toBe(DataType.categorical);
    expect(result.levels).toBeDefined();
    expect(Object.keys(result.levels!)).toEqual(['A', 'B', 'C']);
    expect(result.levels!.A).toEqual({ description: '', standardizedTerm: '' });
    expect(result.levels!.B).toEqual({ description: '', standardizedTerm: '' });
    expect(result.levels!.C).toEqual({ description: '', standardizedTerm: '' });
    expect(result.units).toBeUndefined();
    expect(column.levels).toBeUndefined(); // original column unchanged
  });

  it('should preserve existing levels when switching to categorical', () => {
    const column = createColumn({
      levels: {
        A: { description: 'Existing A', standardizedTerm: 'term:A' },
        B: { description: 'Existing B', standardizedTerm: 'term:B' },
      },
    });
    const allValues = ['A', 'B', 'C'];

    const result = applyDataTypeToColumn(column, DataType.categorical, allValues);

    expect(result.dataType).toBe(DataType.categorical);
    expect(result.levels).toBeDefined();
    expect(result.levels!.A).toEqual({ description: 'Existing A', standardizedTerm: 'term:A' });
    expect(result.levels!.B).toEqual({ description: 'Existing B', standardizedTerm: 'term:B' });
    expect(result.units).toBeUndefined();
  });

  it('should remove units when switching to categorical', () => {
    const column = createColumn({
      dataType: DataType.continuous,
      units: 'years',
    });
    const allValues = ['A', 'B', 'C'];

    const result = applyDataTypeToColumn(column, DataType.categorical, allValues);

    expect(result.dataType).toBe(DataType.categorical);
    expect(result.levels).toBeDefined();
    expect(result.units).toBeUndefined();
  });

  it('should initialize column units attribute when dataType is set to continuous', () => {
    const column = createColumn();
    const allValues = ['25', '30', '35'];

    const result = applyDataTypeToColumn(column, DataType.continuous, allValues);

    expect(result.dataType).toBe(DataType.continuous);
    expect(result.units).toBe('');
    expect(result.levels).toBeUndefined();
  });

  it('should preserve existing units when switching to continuous', () => {
    const column = createColumn({
      units: 'kg',
    });
    const allValues = ['25', '30', '35'];

    const result = applyDataTypeToColumn(column, DataType.continuous, allValues);

    expect(result.dataType).toBe(DataType.continuous);
    expect(result.units).toBe('kg');
    expect(result.levels).toBeUndefined();
  });

  it('should remove levels when switching to continuous', () => {
    const column = createColumn({
      dataType: DataType.categorical,
      levels: {
        A: { description: 'Level A', standardizedTerm: 'term:A' },
      },
    });
    const allValues = ['25', '30', '35'];

    const result = applyDataTypeToColumn(column, DataType.continuous, allValues);

    expect(result.dataType).toBe(DataType.continuous);
    expect(result.units).toBe('');
    expect(result.levels).toBeUndefined();
  });

  it('should clear dataType, levels, and units when dataType is null', () => {
    const column = createColumn({
      dataType: DataType.categorical,
      levels: {
        A: { description: 'Level A', standardizedTerm: 'term:A' },
      },
      units: 'years',
    });
    const allValues = ['A', 'B'];

    const result = applyDataTypeToColumn(column, null, allValues);

    expect(result.dataType).toBeNull();
    expect(result.levels).toBeUndefined();
    expect(result.units).toBeUndefined();
  });

  it('should handle empty allValues array for categorical', () => {
    const column = createColumn();
    const allValues: string[] = [];

    const result = applyDataTypeToColumn(column, DataType.categorical, allValues);

    expect(result.dataType).toBe(DataType.categorical);
    expect(result.levels).toBeDefined();
    expect(Object.keys(result.levels!)).toEqual([]);
  });

  it('should handle empty strings in allValues for categorical', () => {
    const column = createColumn();
    const allValues = ['A', '', 'B', ''];

    const result = applyDataTypeToColumn(column, DataType.categorical, allValues);

    expect(result.dataType).toBe(DataType.categorical);
    expect(result.levels).toBeDefined();
    expect(Object.keys(result.levels!)).toEqual(['A', '', 'B']);
    expect(result.levels!['']).toEqual({ description: '', standardizedTerm: '' });
  });
});
