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

    const parseList = (str?: string) => {
      if (!str) return undefined;
      const parsed = str
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s !== '');
      return parsed.length > 0 ? parsed : undefined;
    };

    const authors = parseList(datasetDescription.Authors);
    if (authors) finalDesc.Authors = authors;

    const references = parseList(datasetDescription.ReferencesAndLinks);
    if (references) finalDesc.ReferencesAndLinks = references;

    const keywords = parseList(datasetDescription.Keywords);
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
