import { useMemo } from 'react';
import { useDatasetDescription, useColumns, useStandardizedVariables } from '../stores/data';
import { useDatasetDescriptionFormValidation } from './useDatasetDescriptionFormValidation';

export function useGenerateDatasetDescription() {
  const datasetDescription = useDatasetDescription();
  const columns = useColumns();
  const standardizedVariables = useStandardizedVariables();
  const { isFormInvalid } = useDatasetDescriptionFormValidation();

  const participantCount = useMemo(() => {
    let count = 0;
    const participantColumn = Object.values(columns).find((col) => {
      const stdVar = col.standardizedVariable
        ? standardizedVariables[col.standardizedVariable]
        : null;
      return stdVar?.name === 'Participant ID';
    });

    if (participantColumn) {
      const uniqueIDs = new Set(participantColumn.allValues);
      count = uniqueIDs.size;
    }
    return count;
  }, [columns, standardizedVariables]);

  const finalDatasetDescription = useMemo(() => {
    if (isFormInvalid) {
      return null;
    }

    const finalDesc: Record<string, string | number | string[]> = {};
    const listFields = ['Authors', 'ReferencesAndLinks', 'Keywords'];

    Object.entries(datasetDescription).forEach(([k, v]) => {
      if (listFields.includes(k) && typeof v === 'string') {
        const parsedList = v
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s !== '');
        if (parsedList.length > 0) {
          finalDesc[k] = parsedList;
        }
      } else if (Array.isArray(v)) {
        if (v.length > 0) {
          finalDesc[k] = v;
        }
      } else if (typeof v === 'string' && v.trim() !== '') {
        finalDesc[k] = v.trim();
      }
    });

    if (participantCount > 0) {
      finalDesc.ParticipantCount = participantCount;
    }

    return finalDesc;
  }, [datasetDescription, participantCount, isFormInvalid]);

  return finalDatasetDescription;
}
