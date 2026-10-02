import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { View } from '../utils/internal_types';
import { usePageAlerts } from './usePageAlerts';
import * as participantHook from './useParticipantIdStatus';

vi.mock('./useParticipantIdStatus', () => ({
  useParticipantIdStatus: vi.fn(),
}));

describe('usePageAlerts', () => {
  describe('alert definitions', () => {
    it('should return participant-id-missing-values error with all expected fields', () => {
      vi.mocked(participantHook.useParticipantIdStatus).mockReturnValue({
        hasMappedParticipantId: true,
        hasMappedOtherColumns: true,
        hasParticipantIdMissingValues: true,
        participantIdColumnName: 'participant_id',
      });

      const { result } = renderHook(() => usePageAlerts(View.ColumnAnnotation));
      expect(result.current).toHaveLength(1);
      expect(result.current[0]).toMatchObject({
        id: 'participant-id-missing-values',
        severity: 'error',
        title: 'Missing values in Participant ID column',
        dataCy: 'participant-id-missing-values-error',
        message:
          'The column, participant_id mapped to Participant ID, contains missing or empty values. Please ensure every row has a valid participant ID in your tabular file.',
      });
    });

    it('should format participant-id-missing-values error message without column name if empty', () => {
      vi.mocked(participantHook.useParticipantIdStatus).mockReturnValue({
        hasMappedParticipantId: true,
        hasMappedOtherColumns: true,
        hasParticipantIdMissingValues: true,
        participantIdColumnName: '',
      });

      const { result } = renderHook(() => usePageAlerts(View.ColumnAnnotation));
      expect(result.current[0].message).toBe(
        'The column mapped to Participant ID, contains missing or empty values. Please ensure every row has a valid participant ID in your tabular file.'
      );
    });

    it('should return missing-participant-id warning with all expected fields', () => {
      vi.mocked(participantHook.useParticipantIdStatus).mockReturnValue({
        hasMappedParticipantId: false,
        hasMappedOtherColumns: true,
        hasParticipantIdMissingValues: false,
        participantIdColumnName: null,
      });

      const { result } = renderHook(() => usePageAlerts(View.ColumnAnnotation));
      expect(result.current).toHaveLength(1);
      expect(result.current[0]).toMatchObject({
        id: 'missing-participant-id',
        severity: 'warning',
        title: 'Missing Participant ID column',
        dataCy: 'missing-participant-id-warning',
      });
      expect(result.current[0].message).toBeDefined();
    });
  });

  describe('view routing', () => {
    describe('ColumnAnnotation view', () => {
      it('should return missing-participant-id warning when other columns are mapped but participant ID is not', () => {
        vi.mocked(participantHook.useParticipantIdStatus).mockReturnValue({
          hasMappedParticipantId: false,
          hasMappedOtherColumns: true,
          hasParticipantIdMissingValues: false,
          participantIdColumnName: null,
        });

        const { result } = renderHook(() => usePageAlerts(View.ColumnAnnotation));
        expect(result.current.map((a) => a.id)).toEqual(['missing-participant-id']);
      });

      it('should return participant-id-missing-values error when participant ID column has missing values', () => {
        vi.mocked(participantHook.useParticipantIdStatus).mockReturnValue({
          hasMappedParticipantId: true,
          hasMappedOtherColumns: true,
          hasParticipantIdMissingValues: true,
          participantIdColumnName: 'participant_id',
        });

        const { result } = renderHook(() => usePageAlerts(View.ColumnAnnotation));
        expect(result.current.map((a) => a.id)).toEqual(['participant-id-missing-values']);
      });

      it('should return an empty array when participant ID is properly mapped and has no missing values', () => {
        vi.mocked(participantHook.useParticipantIdStatus).mockReturnValue({
          hasMappedParticipantId: true,
          hasMappedOtherColumns: true,
          hasParticipantIdMissingValues: false,
          participantIdColumnName: 'sub_id',
        });

        const { result } = renderHook(() => usePageAlerts(View.ColumnAnnotation));
        expect(result.current).toEqual([]);
      });
    });

    describe('Download view', () => {
      it('should return participant-id-missing-values error when participant ID has missing values', () => {
        vi.mocked(participantHook.useParticipantIdStatus).mockReturnValue({
          hasMappedParticipantId: true,
          hasMappedOtherColumns: true,
          hasParticipantIdMissingValues: true,
          participantIdColumnName: 'participant_id',
        });

        const { result } = renderHook(() => usePageAlerts(View.Download));
        expect(result.current.map((a) => a.id)).toEqual(['participant-id-missing-values']);
      });

      it('should not return missing-participant-id warning on download page even if unmapped', () => {
        vi.mocked(participantHook.useParticipantIdStatus).mockReturnValue({
          hasMappedParticipantId: false,
          hasMappedOtherColumns: true,
          hasParticipantIdMissingValues: false,
          participantIdColumnName: null,
        });

        const { result } = renderHook(() => usePageAlerts(View.Download));
        expect(result.current).toEqual([]);
      });

      it('should return an empty array when participant ID is properly mapped and has no missing values', () => {
        vi.mocked(participantHook.useParticipantIdStatus).mockReturnValue({
          hasMappedParticipantId: true,
          hasMappedOtherColumns: true,
          hasParticipantIdMissingValues: false,
          participantIdColumnName: 'sub_id',
        });

        const { result } = renderHook(() => usePageAlerts(View.Download));
        expect(result.current).toEqual([]);
      });
    });

    describe('DatasetDescription view', () => {
      it('should return missing-participant-id warning when participant ID is unmapped', () => {
        vi.mocked(participantHook.useParticipantIdStatus).mockReturnValue({
          hasMappedParticipantId: false,
          hasMappedOtherColumns: true,
          hasParticipantIdMissingValues: false,
          participantIdColumnName: null,
        });

        const { result } = renderHook(() => usePageAlerts(View.DatasetDescription));
        expect(result.current.map((a) => a.id)).toEqual(['missing-participant-id']);
      });

      it('should not return participant-id-missing-values error on datasetDescription page', () => {
        vi.mocked(participantHook.useParticipantIdStatus).mockReturnValue({
          hasMappedParticipantId: true,
          hasMappedOtherColumns: true,
          hasParticipantIdMissingValues: true,
          participantIdColumnName: 'participant_id',
        });

        const { result } = renderHook(() => usePageAlerts(View.DatasetDescription));
        expect(result.current).toEqual([]);
      });

      it('should return an empty array when participant ID is properly mapped', () => {
        vi.mocked(participantHook.useParticipantIdStatus).mockReturnValue({
          hasMappedParticipantId: true,
          hasMappedOtherColumns: true,
          hasParticipantIdMissingValues: false,
          participantIdColumnName: 'sub_id',
        });

        const { result } = renderHook(() => usePageAlerts(View.DatasetDescription));
        expect(result.current).toEqual([]);
      });
    });
  });
});
