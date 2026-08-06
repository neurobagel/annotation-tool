import { useMemo } from 'react';
import { useDatasetDescription, useColumns, useStandardizedVariables } from '../stores/data';
import { DatasetDescription } from '../utils/internal_types';
import { useDatasetDescriptionFormValidation } from './useDatasetDescriptionFormValidation';

export function useGenerateDatasetDescription(): DatasetDescription | null {
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

    const finalDesc: DatasetDescription = {
      Name: datasetDescription.Name.trim(),
    };

    const cleanList = (arr?: string[]) => {
      if (!arr) return undefined;
      const cleaned = arr.map((s) => s.trim()).filter((s) => s !== '');
      return cleaned.length > 0 ? cleaned : undefined;
    };

    const authors = cleanList(datasetDescription.Authors);
    if (authors) finalDesc.Authors = authors;

    const references = cleanList(datasetDescription.ReferencesAndLinks);
    if (references) finalDesc.ReferencesAndLinks = references;

    const keywords = cleanList(datasetDescription.Keywords);
    if (keywords) finalDesc.Keywords = keywords;

    if (datasetDescription.AccessType?.trim())
      finalDesc.AccessType = datasetDescription.AccessType.trim();
    if (datasetDescription.AccessInstructions?.trim())
      finalDesc.AccessInstructions = datasetDescription.AccessInstructions.trim();
    if (datasetDescription.RepositoryURL?.trim())
      finalDesc.RepositoryURL = datasetDescription.RepositoryURL.trim();
    if (datasetDescription.AccessEmail?.trim())
      finalDesc.AccessEmail = datasetDescription.AccessEmail.trim();
    if (datasetDescription.AccessLink?.trim())
      finalDesc.AccessLink = datasetDescription.AccessLink.trim();

    if (participantCount > 0) {
      finalDesc.ParticipantCount = participantCount;
    }

    return finalDesc;
  }, [datasetDescription, participantCount, isFormInvalid]);

  return finalDatasetDescription;
}
