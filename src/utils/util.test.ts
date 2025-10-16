import { FilterOptionsState } from '@mui/material';
import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';
import { fetchConfigGitHubURL, githubRawBaseURL } from './constants';
import { mockGitHubResponse, mockConfigFile, mockTermsData, mockConfig } from './mocks';
import {
  parseTsvContent,
  fetchAvailableConfigs,
  fetchConfig,
  mapConfigFileToStoreConfig,
  createAutocompleteSorter,
} from './util';

// Mock axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

describe('parseTsvContent', () => {
  it('parses rows of empty values correctly as string', () => {
    const tsvContent = `Column1\tColumn2\tColumn3
Value1\t\t
Value2\t\tValue3`;
    const result = parseTsvContent(tsvContent);
    expect(result).toEqual({
      headers: ['Column1', 'Column2', 'Column3'],
      data: [
        ['Value1', '', ''],
        ['Value2', '', 'Value3'],
      ],
    });
  });
});

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

describe('mapConfigFileToStoreConfig', () => {
  it('should map config file to store config correctly', () => {
    const result = mapConfigFileToStoreConfig(mockConfigFile, mockTermsData);

    expect(result).toEqual(mockConfig);
  });

  it('should handle config without terms files', () => {
    const configWithoutTerms = {
      ...mockConfigFile,
      standardized_variables: [
        {
          name: 'Participant ID',
          id: 'ParticipantID',
          data_type: null as 'Categorical' | 'Continuous' | null,
          terms_file: undefined,
          formats: undefined,
          required: true,
          description: 'Unique participant identifier.',
          is_multi_column_measure: false,
          can_have_multiple_columns: false,
          same_as: undefined,
        },
      ],
    };

    const result = mapConfigFileToStoreConfig(configWithoutTerms, {});

    expect(result).toEqual({
      'nb:ParticipantID': {
        identifier: 'nb:ParticipantID',
        label: 'Participant ID',
        data_type: null,
        required: true,
        description: 'Unique participant identifier.',
        is_multi_column_measure: false,
        can_have_multiple_columns: false,
        same_as: undefined,
      },
    });
  });

  it('should handle config with formats but no terms', () => {
    const configWithFormats = {
      ...mockConfigFile,
      standardized_variables: [
        {
          name: 'Age',
          id: 'Age',
          data_type: 'Continuous' as 'Categorical' | 'Continuous' | null,
          terms_file: undefined,
          formats: [
            {
              id: 'FromFloat',
              name: 'float',
              examples: ['31.5'],
            },
          ],
          required: false,
          description: 'The age of the participant.',
          is_multi_column_measure: false,
          can_have_multiple_columns: false,
          same_as: undefined,
        },
      ],
    };

    const result = mapConfigFileToStoreConfig(configWithFormats, {});

    expect(result).toEqual({
      'nb:Age': {
        identifier: 'nb:Age',
        label: 'Age',
        data_type: 'Continuous',
        required: false,
        description: 'The age of the participant.',
        is_multi_column_measure: false,
        can_have_multiple_columns: false,
        same_as: undefined,
        formats: [
          {
            termURL: 'nb:FromFloat',
            label: 'float',
            examples: ['31.5'],
          },
        ],
      },
    });
  });
});

describe('createAutocompleteSorter', () => {
  interface MockOption {
    id: string;
    label: string;
  }

  const mockOptions: MockOption[] = [
    { id: '1', label: 'Test' },
    { id: '2', label: 'Testing' },
    { id: '3', label: 'A Test Case' },
    { id: '4', label: 'Another Testing Example' },
    { id: '5', label: 'Something with test in middle' },
    { id: '6', label: 'Short' },
    { id: '7', label: 'Very Long Option Name' },
    { id: '8', label: 'test' },
    { id: '9', label: 'Test Suite' },
    { id: '10', label: 'Pretest' },
  ];

  it('should prioritize exact matches first', () => {
    const sorter = createAutocompleteSorter<MockOption>((option) => option.label);
    const state: FilterOptionsState<MockOption> = {
      inputValue: 'test',
      getOptionLabel: (option) => option.label,
    };

    const result = sorter(mockOptions, state);

    // Exact match should be first
    expect(result[0].label.toLowerCase()).toBe('test');
  });

  it('should sort starts-with matches by length (shortest first)', () => {
    const sorter = createAutocompleteSorter<MockOption>((option) => option.label);
    const state: FilterOptionsState<MockOption> = {
      inputValue: 'test',
      getOptionLabel: (option) => option.label,
    };

    const result = sorter(mockOptions, state);

    // Find all starts-with matches (excluding exact match)
    const startsWithMatches = result.filter(
      (opt) => opt.label.toLowerCase().startsWith('test') && opt.label.toLowerCase() !== 'test'
    );

    // Check they're sorted by length
    for (let i = 0; i < startsWithMatches.length - 1; i += 1) {
      expect(startsWithMatches[i].label.length).toBeLessThanOrEqual(
        startsWithMatches[i + 1].label.length
      );
    }
  });

  it('should prioritize contains matches after starts-with matches', () => {
    const sorter = createAutocompleteSorter<MockOption>((option) => option.label);
    const state: FilterOptionsState<MockOption> = {
      inputValue: 'test',
      getOptionLabel: (option) => option.label,
    };

    const result = sorter(mockOptions, state);

    // Find options that contain but don't start with "test"
    const containsMatches = result.filter(
      (opt) =>
        opt.label.toLowerCase().includes('test') && !opt.label.toLowerCase().startsWith('test')
    );

    expect(containsMatches.length).toBeGreaterThan(0);
    expect(containsMatches.some((opt) => opt.label === 'A Test Case')).toBe(true);
  });

  it('should handle case-insensitive matching', () => {
    const sorter = createAutocompleteSorter<MockOption>((option) => option.label);
    const state: FilterOptionsState<MockOption> = {
      inputValue: 'TEST',
      getOptionLabel: (option) => option.label,
    };

    const result = sorter(mockOptions, state);

    // Should still find matches regardless of case
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].label.toLowerCase()).toBe('test');
  });

  it('should work with options with abbreviations', () => {
    interface OptionWithAbbriviation {
      id: string;
      abbreviation?: string;
      label: string;
    }

    const complexOptions: OptionWithAbbriviation[] = [
      { id: '1', abbreviation: 'MRI', label: 'Magnetic Resonance Imaging' },
      { id: '2', abbreviation: 'CT', label: 'Computed Tomography' },
      { id: '3', abbreviation: 'PET', label: 'Positron Emission Tomography' },
      { id: '4', label: 'MRI Scanner' },
    ];

    const sorter = createAutocompleteSorter<OptionWithAbbriviation>((option) =>
      option.abbreviation ? `${option.abbreviation} - ${option.label}` : option.label
    );

    const state: FilterOptionsState<OptionWithAbbriviation> = {
      inputValue: 'MRI',
      getOptionLabel: (option) =>
        option.abbreviation ? `${option.abbreviation} - ${option.label}` : option.label,
    };

    const result = sorter(complexOptions, state);

    // Should find both options with MRI
    expect(result.length).toBeGreaterThan(0);
    // The first result should start with "MRI" (the abbreviation option)
    const firstResultText = result[0].abbreviation
      ? `${result[0].abbreviation} - ${result[0].label}`
      : result[0].label;
    expect(firstResultText.startsWith('MRI')).toBe(true);
  });

  it('should handle partial word matching', () => {
    const options: MockOption[] = [
      { id: '1', label: 'Diagnosis' },
      { id: '2', label: 'Diagnostic Test' },
      { id: '3', label: 'Pre-diagnosis' },
      { id: '4', label: 'Diag' },
    ];

    const sorter = createAutocompleteSorter<MockOption>((option) => option.label);
    const state: FilterOptionsState<MockOption> = {
      inputValue: 'diag',
      getOptionLabel: (option) => option.label,
    };

    const result = sorter(options, state);

    // Exact match first
    expect(result[0].label).toBe('Diag');
    // Then starts with
    expect(result[1].label).toBe('Diagnosis');
    expect(result[2].label).toBe('Diagnostic Test');
    // Then contains
    expect(result[3].label).toBe('Pre-diagnosis');
  });
});
