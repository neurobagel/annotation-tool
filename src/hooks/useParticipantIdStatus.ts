import { useMemo } from 'react';
import { useColumns, useStandardizedVariables } from '../stores/data';

export function useParticipantIdStatus(): {
  hasMappedParticipantId: boolean;
  hasMappedOtherColumns: boolean;
  hasParticipantIdMissingValues: boolean;
  participantIdColumnName: string | null;
} {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();

  return useMemo(() => {
    let hasMappedParticipantId = false;
    let hasMappedOtherColumns = false;
    let hasParticipantIdMissingValues = false;
    let participantIdColumnName: string | null = null;

    Object.values(columns).forEach((col) => {
      let isParticipantId = false;
      if (col.standardizedVariable) {
        const stdVar = standardizedVariables[col.standardizedVariable];
        if (stdVar?.name === 'Participant ID') {
          isParticipantId = true;
        }
      }

      if (isParticipantId) {
        hasMappedParticipantId = true;
        participantIdColumnName = col.name ?? null;
        if (
          (col.missingValues?.length ?? 0) > 0 ||
          col.allValues.some((val) => val.trim() === '')
        ) {
          hasParticipantIdMissingValues = true;
        }
      } else if (
        (col.standardizedVariable !== undefined && col.standardizedVariable !== null) ||
        (col.isPartOf !== undefined && col.isPartOf !== null)
      ) {
        hasMappedOtherColumns = true;
      }
    });

    return {
      hasMappedParticipantId,
      hasMappedOtherColumns,
      hasParticipantIdMissingValues,
      participantIdColumnName,
    };
  }, [columns, standardizedVariables]);
}
