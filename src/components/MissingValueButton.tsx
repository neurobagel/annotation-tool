import { Button } from '@mui/material';

interface MissingValueButtonProps {
  value: string;
  columnId: string;
  missingValues: string[];
  onToggleMissingValue: (columnId: string, value: string, isMissing: boolean) => void;
}

function MissingValueButton({
  value,
  columnId,
  missingValues,
  onToggleMissingValue,
}: MissingValueButtonProps) {
  const isMissing = missingValues.includes(value);

  const handleClick = () => {
    onToggleMissingValue(columnId, value, !isMissing);
  };

  return (
    <Button
      variant="contained"
      className={`
        min-w-[170px]
        whitespace-nowrap
        min-w-fit
        px-4
        ${isMissing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-error-main hover:bg-error-dark'}
      `}
      size="small"
      onClick={handleClick}
      data-cy={`${columnId}-${value}-missing-value-button`}
    >
      {isMissing ? 'Mark as not missing' : 'Mark as missing'}
    </Button>
  );
}

export default MissingValueButton;
