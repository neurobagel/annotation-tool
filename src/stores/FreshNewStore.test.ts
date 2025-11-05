import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  mockAvailableConfigOptions,
  mockFreshConfigFile,
  mockTermsData,
  mockFreshStandardizedVariables,
  mockFreshStandardizedTerms,
  mockFreshStandardizedFormats,
} from '../utils/mocks';
import * as storeUtils from '../utils/store-utils';
import {
  useFreshDataActions,
  useConfigOptions,
  useStandardizedVariables,
  useStandardizedTerms,
  useStandardizedFormats,
  useConfig,
} from './FreshNewStore';

const mockedFetchAvailableConfigs = vi.spyOn(storeUtils, 'fetchAvailableConfigs');
const mockedFetchConfig = vi.spyOn(storeUtils, 'fetchConfig');

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
