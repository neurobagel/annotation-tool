import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';
import { fetchConfigGitHubURL, githubRawBaseURL } from './constants';
import { mockGitHubResponse, mockConfigFile, mockTermsData, mockFreshConfigFile } from './mocks';
import {
  fetchAvailableConfigs,
  fetchConfig,
  convertStandardizedVariables,
  convertStandardizedTerms,
  convertStandardizedFormats,
} from './store-utils';

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
      mockFreshConfigFile.standardized_variables,
      mockFreshConfigFile.namespace_prefix
    );

    expect(result).toBeDefined();
    expect(Object.keys(result)).toHaveLength(6);
    expect(result['nb:ParticipantID']).toBeDefined();
    expect(result['nb:Age']).toBeDefined();
  });

  it("should correctly map a standardized variable's properties", () => {
    const result = convertStandardizedVariables(
      mockFreshConfigFile.standardized_variables,
      mockFreshConfigFile.namespace_prefix
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
      mockFreshConfigFile.standardized_variables,
      mockFreshConfigFile.namespace_prefix
    );

    expect(result).toBeDefined();
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

  it("should correctly map a standardized variable's terms", () => {
    const result = convertStandardizedTerms(
      mockTermsData,
      mockFreshConfigFile.standardized_variables,
      mockFreshConfigFile.namespace_prefix
    );

    const adhdTerm = result['snomed:406506008'];
    expect(adhdTerm).toBeDefined();
    expect(adhdTerm.id).toBe('snomed:406506008');
    expect(adhdTerm.label).toBe('Attention deficit hyperactivity disorder');
    expect(adhdTerm.standardizedVariableId).toBe('nb:Diagnosis');
  });
});

describe('convertStandardizedFormats', () => {
  it('should convert formats to StandardizedFormats object', () => {
    const result = convertStandardizedFormats(
      mockFreshConfigFile.standardized_variables,
      mockFreshConfigFile.namespace_prefix
    );

    expect(result).toBeDefined();
    expect(Object.keys(result)).toHaveLength(5);
  });

  it('should correctly map a format', () => {
    const result = convertStandardizedFormats(
      mockFreshConfigFile.standardized_variables,
      mockFreshConfigFile.namespace_prefix
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
      mockFreshConfigFile.standardized_variables,
      mockFreshConfigFile.namespace_prefix
    );

    expect(result['nb:FromFloat']).toBeDefined();
    expect(result['nb:FromEuro']).toBeDefined();
    expect(result['nb:FromBounded']).toBeDefined();
    expect(result['nb:FromRange']).toBeDefined();
    expect(result['nb:FromISO8601']).toBeDefined();
  });
});
