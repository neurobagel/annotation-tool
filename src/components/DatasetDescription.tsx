import { useIsParticipantIDMapped } from '../hooks/useIsParticipantIDMapped';
import DatasetDescriptionForm from './DatasetDescriptionForm';
import MissingParticipantIdAlert from './MissingParticipantIdAlert';

function DatasetDescription() {
  const { hasMappedParticipantId, hasMappedOtherColumns } = useIsParticipantIDMapped();

  return (
    <div className="flex flex-col items-center p-6" data-cy="dataset-description-page">
      {hasMappedOtherColumns && !hasMappedParticipantId && (
        <MissingParticipantIdAlert className="mb-6 w-full max-w-2xl" />
      )}

      <div className="w-full max-w-2xl">
        <DatasetDescriptionForm />
      </div>
    </div>
  );
}

export default DatasetDescription;
