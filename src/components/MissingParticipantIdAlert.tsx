import { Alert, Typography } from '@mui/material';

interface MissingParticipantIdAlertProps {
  className?: string;
}

export default function MissingParticipantIdAlert({ className }: MissingParticipantIdAlertProps) {
  return (
    <Alert severity="warning" data-cy="missing-participant-id-warning" className={className}>
      <Typography variant="h6" className="mb-2 font-bold">
        Missing Participant ID
      </Typography>
      <Typography variant="body1">
        You have not mapped a <b>Participant ID</b> column. Without a Participant ID, your dataset
        description will be incomplete as it cannot calculate the total number of participants.
      </Typography>
    </Alert>
  );
}
