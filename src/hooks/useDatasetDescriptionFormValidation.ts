import { useDatasetDescription } from '../stores/data';
import { isValidUrl, emailRegex } from '../utils/util';

export function useDatasetDescriptionFormValidation() {
  const datasetDescription = useDatasetDescription();

  const isNameInvalid = datasetDescription.Name.trim() === '';
  const isRepoUrlInvalid =
    datasetDescription.RepositoryURL.trim() !== '' &&
    !isValidUrl(datasetDescription.RepositoryURL.trim());
  const isAccessEmailInvalid =
    datasetDescription.AccessEmail.trim() !== '' &&
    !emailRegex.test(datasetDescription.AccessEmail.trim());
  const isAccessLinkInvalid =
    datasetDescription.AccessLink.trim() !== '' &&
    !isValidUrl(datasetDescription.AccessLink.trim());

  const isFormInvalid =
    isNameInvalid || isRepoUrlInvalid || isAccessEmailInvalid || isAccessLinkInvalid;

  return {
    datasetDescriptionFormValidation: {
      Name: isNameInvalid,
      RepositoryURL: isRepoUrlInvalid,
      AccessEmail: isAccessEmailInvalid,
      AccessLink: isAccessLinkInvalid,
    },
    isFormInvalid,
  };
}
