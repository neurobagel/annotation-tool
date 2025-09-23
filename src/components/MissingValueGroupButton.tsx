import { ToggleButton, ToggleButtonGroup } from '@mui/material';

interface MissingValueGroupButtonProps {
  value: string;
  columnId: string;
  missingValues: string[];
  onToggleMissingValue: (columnId: string, value: string, isMissing: boolean) => void;
}

function MissingValueGroupButton({
  value,
  columnId,
  missingValues,
  onToggleMissingValue,
}: MissingValueGroupButtonProps) {
  const isMissing = missingValues.includes(value);

  const handleChange = (_: React.MouseEvent<HTMLElement>, newMissing: boolean | null) => {
    if (newMissing !== null) {
      onToggleMissingValue(columnId, value, newMissing);
    }
  };

  return (
    <ToggleButtonGroup
      value={isMissing}
      exclusive
      onChange={handleChange}
      size="small"
      data-cy={`${columnId}-${value}-missing-value-button-group`}
    >
      <ToggleButton value={false} data-cy={`${columnId}-${value}-missing-value-no`}>
        No
      </ToggleButton>
      <ToggleButton value data-cy={`${columnId}-${value}-missing-value-yes`}>
        Yes
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default MissingValueGroupButton;
