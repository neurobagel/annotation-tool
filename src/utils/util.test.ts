import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';
import { fetchConfigGitHubURL, githubRawBaseURL } from './constants';
import { mockGitHubResponse, mockConfigFile, mockTermsData, mockConfig } from './mocks';
import { fetchAvailableConfigs, fetchConfig, mapConfigFileToStoreConfig } from './util';

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
            {
              id: 'FromInt',
              name: 'int',
              examples: ['31'],
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
          {
            termURL: 'nb:FromInt',
            label: 'int',
            examples: ['31'],
          },
        ],
      },
    });
  });
});
