import { GoogleDriveUploadPayload } from './internal_types';

export function getColumnsAssignedText(mappedColumnsCount: number): string {
  if (mappedColumnsCount === 0) return 'No columns assigned';
  if (mappedColumnsCount === 1) return '1 column assigned';
  return `${mappedColumnsCount} columns assigned`;
}

// TODO: refine the logic for generating abbreviations
export function generateAbbreviation(label: string): string {
  if (!label) return '';
  const words = label.trim().split(/[\s_-]+/);
  if (words.length > 1) {
    return words.map((word) => word[0].toUpperCase()).join('');
  }
  return label;
}

// URL validation uses the browser's native WHATWG URL parser (the exact same standard rust-url implements)
export const isValidUrl = (string: string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// Email regex corresponds to the HTML5 specification (approximates the RFC 5322 standard used by Pydantic's email-validator)
export const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const getTimestampSuffix = (): string =>
  new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];

export const createUploadPayload = ({
  datasetName,
  dataDictionary,
  datasetDescription,
  notes,
  reuploadReason,
  name,
  email,
  site,
  password,
  forceOverwrite,
}: GoogleDriveUploadPayload) => {
  const dataDictionaryContent = JSON.stringify(dataDictionary, null, 2);

  const datasetDescriptionFilename = datasetName
    .replace('_annotated', '')
    .replace('.json', '_dataset_description.json');
  const datasetDescriptionContent = datasetDescription
    ? JSON.stringify(datasetDescription, null, 2)
    : null;

  let commentsContent;
  const hasNotes = notes && notes.trim().length > 0;
  const hasReason = reuploadReason && reuploadReason.trim().length > 0;

  if (hasNotes || hasReason) {
    commentsContent = `Uploader Metadata\n=================\nName:  ${name || 'Anonymous'}\nEmail: ${email || 'N/A'}\nDate:  ${new Date().toLocaleString()}\n\n`;

    if (hasReason) {
      commentsContent += `Re-upload Reason:\n-----------------\n${reuploadReason}\n\n`;
    }

    if (hasNotes) {
      commentsContent += `User Notes/Comments:\n--------------------\n${notes}`;
    }
  }

  return {
    folderName: site,
    password,
    commentsContent,
    checkExists: !forceOverwrite,
    files: [
      {
        filename: datasetName,
        content: dataDictionaryContent,
        description: `Data dictionary uploaded by ${name} (${email}). Notes: ${notes}`,
      },
      ...(datasetDescriptionContent
        ? [
            {
              filename: datasetDescriptionFilename,
              content: datasetDescriptionContent,
              description: `Dataset description uploaded by ${name} (${email}).`,
            },
          ]
        : []),
    ],
  };
};
