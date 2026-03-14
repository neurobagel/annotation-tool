import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/Help';
import { IconButton, Tooltip, Typography } from '@mui/material';

interface DataTypeDisplayProps {
  columnId: string;
  label: string | null;
  isInferred?: boolean;
  onClear?: () => void;
}

function DataTypeDisplay({ columnId, label, isInferred = false, onClear }: DataTypeDisplayProps) {
  if (label) {
    const tooltipText =
      'Data type is automatically determined by standardized variable selection. \n To change the data type manually, remove the standardized variable';

    const content = (
      <div
        className="h-10 pl-3 pr-1 flex items-center justify-between border rounded border-gray-200 bg-white text-gray-900 w-full shadow-sm"
        data-cy={`${columnId}-column-annotation-card-data-type`}
      >
        <div className="flex items-center min-w-0 pr-2">
          <Typography variant="body2" className="font-medium truncate">
            {label}
          </Typography>
          {isInferred && (
            <HelpIcon sx={{ fontSize: 14 }} className="text-gray-400 ml-1 flex-shrink-0" />
          )}
        </div>
        {onClear && !isInferred && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            data-cy={`${columnId}-clear-data-type`}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
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
        Map to data type
      </Typography>
    </div>
  );
}

DataTypeDisplay.defaultProps = {
  isInferred: false,
};

export default DataTypeDisplay;
