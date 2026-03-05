import HelpIcon from '@mui/icons-material/Help';
import { Tooltip, Typography } from '@mui/material';

interface DataTypeDisplayProps {
  columnId: string;
  label: string | null;
  isInferred?: boolean;
}

function DataTypeDisplay({ columnId, label, isInferred = false }: DataTypeDisplayProps) {
  if (label) {
    const tooltipText =
      'Data type is automatically determined by standardized variable selection. \n To change the data type manually, remove the standardized variable';

    const content = (
      <div
        className="h-10 px-3 flex items-center justify-start border rounded border-gray-200 bg-white text-gray-900 w-full shadow-sm"
        data-cy={`${columnId}-column-annotation-card-data-type`}
      >
        <Typography variant="body2" className="font-medium truncate">
          {label}
        </Typography>
        {isInferred && <HelpIcon sx={{ fontSize: 14 }} className="text-gray-400 ml-1" />}
      </div>
    );

    return isInferred ? (
      <Tooltip title={tooltipText} arrow>
        {content}
      </Tooltip>
    ) : (
      content
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

DataTypeDisplay.defaultProps = {
  isInferred: false,
};

export default DataTypeDisplay;
