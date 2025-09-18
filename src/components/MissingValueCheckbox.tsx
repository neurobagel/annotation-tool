import { Checkbox } from '@mui/material';

interface MissingValueCheckboxProps {
  value: string;
  columnId: string;
  missingValues: string[];
  onToggleMissingValue: (columnId: string, value: string, isMissing: boolean) => void;
}

function MissingValueCheckbox({
  value,
  columnId,
  missingValues,
  onToggleMissingValue,
}: MissingValueCheckboxProps) {
  const isMissing = missingValues.includes(value);

  const handleChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onToggleMissingValue(columnId, value, checked);
  };

  return (
    <Checkbox
      size="small"
      color="primary"
      checked={isMissing}
      onChange={handleChange}
      data-cy={`${columnId}-${value}-missing-value-checkbox`}
    />
  );
}

export default MissingValueCheckbox;
