import { useMemo } from 'react';
import { AlertItem } from '../components/PageAlert';
import { View } from '../utils/internal_types';
import { useParticipantIdStatus } from './useParticipantIdStatus';

export function usePageAlerts(view: View): AlertItem[] {
  const {
    hasMappedParticipantId,
    hasMappedOtherColumns,
    hasParticipantIdMissingValues,
    participantIdColumnName,
  } = useParticipantIdStatus();

  return useMemo(() => {
    const alerts: AlertItem[] = [];
    const columnText = participantIdColumnName ? `, ${participantIdColumnName}` : '';

    if (
      hasParticipantIdMissingValues &&
      (view === View.ColumnAnnotation || view === View.Download)
    ) {
      alerts.push({
        id: 'participant-id-missing-values',
        severity: 'error',
        title: 'Missing values in Participant ID column',
        message: `The column${columnText} mapped to Participant ID, contains missing or empty values. Please ensure every row has a valid participant ID in your tabular file.`,
        dataCy: 'participant-id-missing-values-error',
      });
    }

    if (
      hasMappedOtherColumns &&
      !hasMappedParticipantId &&
      (view === View.ColumnAnnotation || view === View.DatasetDescription)
    ) {
      alerts.push({
        id: 'missing-participant-id',
        severity: 'warning',
        title: 'Missing Participant ID column',
        message: (
          <>
            You have not mapped a <b>Participant ID</b> column. Without a Participant ID, your
            dataset description will be incomplete as it cannot calculate the total number of
            participants.
          </>
        ),
        dataCy: 'missing-participant-id-warning',
      });
    }

    return alerts;
  }, [
    view,
    hasMappedOtherColumns,
    hasMappedParticipantId,
    hasParticipantIdMissingValues,
    participantIdColumnName,
  ]);
}

export default usePageAlerts;
