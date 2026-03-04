import { Tooltip, Typography } from '@mui/material';
import { DataType } from '~/utils/internal_types';

interface DataTypeDisplayProps {
  columnId: string;
  value: DataType | null;
  inferredLabel: string | null;
}

function DataTypeDisplay({ columnId, value, inferredLabel }: DataTypeDisplayProps) {
  const displayValue = inferredLabel || value;

  let label = displayValue;
  if (displayValue === DataType.categorical) {
    label = 'Categorical';
  } else if (displayValue === DataType.continuous) {
    label = 'Continuous';
  }

  if (displayValue) {
    return (
      <Tooltip title="Data type" arrow>
        <div
          className="h-10 px-3 flex items-center justify-start border rounded border-gray-200 bg-white text-gray-900 w-full shadow-sm"
          data-cy={`${columnId}-column-annotation-card-data-type`}
        >
          <Typography variant="body2" className="font-medium truncate">
            {label}
          </Typography>
        </div>
      </Tooltip>
    );
  }

  return (
    <div
      className="h-10 px-3 flex items-center justify-start text-gray-400 w-full"
      data-cy={`${columnId}-column-annotation-card-data-type-unassigned`}
    >
      <Typography variant="body2" className="italic truncate">
        Assign data type
      </Typography>
    </div>
  );
}

export default DataTypeDisplay;
