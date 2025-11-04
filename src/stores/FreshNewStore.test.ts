import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import mockTsvRaw from '../../cypress/fixtures/examples/mock.tsv?raw';
import {
  mockAvailableConfigOptions,
  mockFreshConfigFile,
  mockTermsData,
  mockFreshStandardizedVariables,
  mockFreshStandardizedTerms,
  mockFreshStandardizedFormats,
  mockFreshColumnsAfterDataTableUpload,
} from '../utils/mocks';
import {
  fetchAvailableConfigs,
  fetchConfig,
  readFile,
  parseTsvContent,
} from '../utils/store-utils';
import {
  useFreshDataActions,
  useConfigOptions,
  useStandardizedVariables,
  useStandardizedTerms,
  useStandardizedFormats,
  useConfig,
  useColumns,
  useUploadedDataTableFileName,
} from './FreshNewStore';

// Mock the store-utils module
vi.mock('../utils/store-utils');
const mockedFetchAvailableConfigs = vi.mocked(fetchAvailableConfigs);
const mockedFetchConfig = vi.mocked(fetchConfig);
const mockedReadFile = vi.mocked(readFile);
const mockedParseTsvContent = vi.mocked(parseTsvContent);

describe('appFetchesConfigOptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should fetch available configs and update configOptions state on success', async () => {
    mockedFetchAvailableConfigs.mockResolvedValueOnce(mockAvailableConfigOptions);

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      configOptions: useConfigOptions(),
    }));

    await act(async () => {
      await result.current.actions.appFetchesConfigOptions();
    });

    expect(mockedFetchAvailableConfigs).toHaveBeenCalledOnce();
    expect(result.current.configOptions).toEqual(mockAvailableConfigOptions);
  });

  it('should set configOptions to empty array when fetch fails', async () => {
    mockedFetchAvailableConfigs.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      configOptions: useConfigOptions(),
    }));

    await act(async () => {
      await result.current.actions.appFetchesConfigOptions();
    });

    expect(mockedFetchAvailableConfigs).toHaveBeenCalledOnce();
    expect(result.current.configOptions).toEqual([]);
  });
});

describe('userSelectsConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should update all store states on success', async () => {
    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockTermsData,
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      config: useConfig(),
      standardizedVariables: useStandardizedVariables(),
      standardizedTerms: useStandardizedTerms(),
      standardizedFormats: useStandardizedFormats(),
    }));

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    expect(mockedFetchConfig).toHaveBeenCalledWith('Neurobagel');
    expect(result.current.config).toBe('Neurobagel');
    expect(result.current.standardizedVariables).toEqual(mockFreshStandardizedVariables);
    expect(result.current.standardizedTerms).toEqual(mockFreshStandardizedTerms);
    expect(result.current.standardizedFormats).toEqual(mockFreshStandardizedFormats);
  });

  it('should correctly map standardized variables with all properties', async () => {
    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockTermsData,
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      standardizedVariables: useStandardizedVariables(),
    }));

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    const ageVariable = result.current.standardizedVariables['nb:Age'];
    expect(ageVariable).toBeDefined();
    expect(ageVariable.id).toBe('nb:Age');
    expect(ageVariable.name).toBe('Age');
    expect(ageVariable.variable_type).toBe('Continuous');
    expect(ageVariable.description).toBe('The age of the participant.');
    expect(ageVariable.required).toBe(false);
  });

  it('should correctly map terms from multiple vocabularies', async () => {
    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockTermsData,
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      standardizedTerms: useStandardizedTerms(),
    }));

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    // Check sex terms
    const maleTerm = result.current.standardizedTerms['snomed:248153007'];
    expect(maleTerm).toBeDefined();
    expect(maleTerm.id).toBe('snomed:248153007');
    expect(maleTerm.label).toBe('Male');
    expect(maleTerm.standardizedVariableId).toBe('nb:Sex');

    // Check diagnosis terms
    const adhdTerm = result.current.standardizedTerms['snomed:406506008'];
    expect(adhdTerm).toBeDefined();
    expect(adhdTerm.label).toBe('Attention deficit hyperactivity disorder');
    expect(adhdTerm.standardizedVariableId).toBe('nb:Diagnosis');

    // Check assessment terms
    const assessmentTerm = result.current.standardizedTerms['snomed:1303696008'];
    expect(assessmentTerm).toBeDefined();
    expect(assessmentTerm.label).toBe('Robson Ten Group Classification System');
    expect(assessmentTerm.standardizedVariableId).toBe('nb:Assessment');
  });

  it('should correctly map formats with proper identifiers', async () => {
    mockedFetchConfig.mockResolvedValueOnce({
      config: mockFreshConfigFile,
      termsData: mockTermsData,
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      standardizedFormats: useStandardizedFormats(),
    }));

    await act(async () => {
      await result.current.actions.userSelectsConfig('Neurobagel');
    });

    const floatFormat = result.current.standardizedFormats['nb:FromFloat'];
    expect(floatFormat).toBeDefined();
    expect(floatFormat.identifier).toBe('nb:FromFloat');
    expect(floatFormat.label).toBe('float');
    expect(floatFormat.standardizedVariableId).toBe('nb:Age');
    expect(floatFormat.examples).toEqual(['31.5']);

    const iso8601Format = result.current.standardizedFormats['nb:FromISO8601'];
    expect(iso8601Format).toBeDefined();
    expect(iso8601Format.identifier).toBe('nb:FromISO8601');
    expect(iso8601Format.label).toBe('iso8601');
    expect(iso8601Format.examples).toEqual(['31Y6M']);
  });
});

describe('userUploadedDataTableFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should read, parse, and populate columns state with uploaded TSV file', async () => {
    const mockFile = new File([mockTsvRaw], 'mock.tsv', { type: 'text/tab-separated-values' });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['participant_id', 'age', 'sex', 'group_dx', 'group', 'iq'],
      data: [
        ['sub-718211', '28.4', 'M', 'ADHD', 'HC', '80'],
        ['sub-718213', '24.6', 'F', 'ADHD', 'HC', '90'],
        ['sub-718216', '43.6', 'M', 'PD', 'HC', '100'],
        ['sub-718217', '28.4', 'F', 'PD', 'HC', '110'],
        ['sub-718218', '72.1', 'M', 'PD', 'HC', '65'],
        ['sub-718219', '56.2', 'M', 'PD', 'N/A', '87'],
        ['sub-718220', '23', 'M', 'PD', 'HC', '94'],
        ['sub-718221', '22', 'F', 'PD', 'HC', '90'],
        ['sub-718222', '21', 'M', 'PD', 'Patient', '81'],
        ['sub-718223', '45', 'F', 'PD', 'HC', '66'],
        ['sub-718224', '34', 'M', 'ADHD', 'HC', '67'],
        ['sub-718225', '65', 'N/A', 'PD', 'HC', '83'],
      ],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
      fileName: useUploadedDataTableFileName(),
    }));

    await act(async () => {
      await result.current.actions.userUploadedDataTableFile(mockFile);
    });

    expect(mockedReadFile).toHaveBeenCalledWith(mockFile);
    expect(mockedParseTsvContent).toHaveBeenCalledWith(mockTsvRaw);
    expect(result.current.columns).toEqual(mockFreshColumnsAfterDataTableUpload);
    expect(result.current.fileName).toBe('mock.tsv');
  });

  it('should handle empty values in columns correctly', async () => {
    const tsvWithEmptyValues = `col1\tcol2\tcol3
value1\t\tvalue3
value4\tvalue5\t
\tvalue8\tvalue9`;

    const mockFile = new File([tsvWithEmptyValues], 'data-with-empty.tsv', {
      type: 'text/tab-separated-values',
    });

    mockedReadFile.mockResolvedValueOnce(tsvWithEmptyValues);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['col1', 'col2', 'col3'],
      data: [
        ['value1', '', 'value3'],
        ['value4', 'value5', ''],
        ['', 'value8', 'value9'],
      ],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadedDataTableFile(mockFile);
    });

    expect(result.current.columns['0'].allValues).toEqual(['value1', 'value4', '']);
    expect(result.current.columns['1'].allValues).toEqual(['', 'value5', 'value8']);
    expect(result.current.columns['2'].allValues).toEqual(['value3', '', 'value9']);
  });

  it('should use column index as id and header as name', async () => {
    const mockFile = new File([mockTsvRaw], 'test.tsv', { type: 'text/tab-separated-values' });

    mockedReadFile.mockResolvedValueOnce(mockTsvRaw);
    mockedParseTsvContent.mockReturnValueOnce({
      headers: ['participant_id', 'age', 'sex', 'group_dx', 'group', 'iq'],
      data: [['sub-718211', '28.4', 'M', 'ADHD', 'HC', '80']],
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
    }));

    await act(async () => {
      await result.current.actions.userUploadedDataTableFile(mockFile);
    });

    expect(result.current.columns['0'].id).toBe('0');
    expect(result.current.columns['0'].name).toBe('participant_id');
    expect(result.current.columns['1'].id).toBe('1');
    expect(result.current.columns['1'].name).toBe('age');
    expect(result.current.columns['2'].id).toBe('2');
    expect(result.current.columns['2'].name).toBe('sex');
    expect(result.current.columns['3'].id).toBe('3');
    expect(result.current.columns['3'].name).toBe('group_dx');
    expect(result.current.columns['4'].id).toBe('4');
    expect(result.current.columns['4'].name).toBe('group');
    expect(result.current.columns['5'].id).toBe('5');
    expect(result.current.columns['5'].name).toBe('iq');
  });

  it('should reset columns and fileName to initial state when file reading fails', async () => {
    const mockFile = new File(['invalid'], 'invalid.tsv', { type: 'text/tab-separated-values' });

    mockedReadFile.mockRejectedValueOnce(new Error('File read error'));

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
      fileName: useUploadedDataTableFileName(),
    }));

    await act(async () => {
      await result.current.actions.userUploadedDataTableFile(mockFile);
    });

    expect(mockedReadFile).toHaveBeenCalledWith(mockFile);
    expect(result.current.columns).toEqual({});
    expect(result.current.fileName).toBeNull();
  });

  it('should reset columns and fileName when parsing fails', async () => {
    const tsvContent = 'some\tcontent';
    const mockFile = new File([tsvContent], 'test.tsv', { type: 'text/tab-separated-values' });

    mockedReadFile.mockResolvedValueOnce(tsvContent);
    mockedParseTsvContent.mockImplementationOnce(() => {
      throw new Error('Parse error');
    });

    const { result } = renderHook(() => ({
      actions: useFreshDataActions(),
      columns: useColumns(),
      fileName: useUploadedDataTableFileName(),
    }));

    await act(async () => {
      await result.current.actions.userUploadedDataTableFile(mockFile);
    });

    expect(result.current.columns).toEqual({});
    expect(result.current.fileName).toBeNull();
  });
});
