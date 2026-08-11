import { useMemo } from 'react';
import { useColumns, useStandardizedVariables } from '../stores/data';

export function useIsParticipantIDMapped(): {
  hasMappedParticipantId: boolean;
  hasMappedOtherColumns: boolean;
} {
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();

  return useMemo(() => {
    let hasMappedParticipantId = false;
    let hasMappedOtherColumns = false;

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
    };
  }, [columns, standardizedVariables]);
}
