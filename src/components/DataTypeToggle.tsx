import HelpIcon from '@mui/icons-material/Help';
import { ToggleButtonGroup, ToggleButton, Tooltip, Typography } from '@mui/material';
import { DataType } from '~/utils/internal_types';

interface DataTypeToggleProps {
  columnId: string;
  value: DataType | null;
  isEditable: boolean;
  inferredLabel: string | null;
  onChange: (columnId: string, newDataType: 'Categorical' | 'Continuous' | null) => void;
}

function DataTypeToggle({
  columnId,
  value,
  isEditable,
  inferredLabel,
  onChange,
}: DataTypeToggleProps) {
  if (isEditable) {
    return (
      <ToggleButtonGroup
        data-cy={`${columnId}-column-annotation-card-data-type`}
        value={value}
        onChange={(_, newDataType) => onChange(columnId, newDataType)}
        exclusive
        color="primary"
        size="small"
        className="shadow-sm w-full flex h-10"
      >
        <Tooltip title="Categorical" arrow>
          <ToggleButton
            data-cy={`${columnId}-column-annotation-card-data-type-categorical-button`}
            value={DataType.categorical}
            className="px-2 flex-1 w-1/2"
          >
            <span className="text-xs font-semibold">Cat.</span>
          </ToggleButton>
        </Tooltip>

        <Tooltip title="Continuous" arrow>
          <ToggleButton
            data-cy={`${columnId}-column-annotation-card-data-type-continuous-button`}
            value={DataType.continuous}
            className="px-2 flex-1 w-1/2"
          >
            <span className="text-xs font-semibold">Cont.</span>
          </ToggleButton>
        </Tooltip>
      </ToggleButtonGroup>
    );
  }

  return (
    <Tooltip
      title={
        'Data type is automatically determined by standardized variable selection. \n' +
        ' To change the data type manually, remove the standardized variable'
      }
      arrow
    >
      <div
        className="h-10 px-2 flex items-center justify-center border rounded border-gray-200 bg-gray-50/50 text-gray-500 cursor-not-allowed w-full shadow-sm"
        data-cy={`${columnId}-column-annotation-card-data-type`}
        tabIndex={0}
        role="button"
      >
        <Typography variant="caption" className="font-medium truncate">
          {inferredLabel || value || 'Unknown'}
        </Typography>
        <HelpIcon sx={{ fontSize: 14 }} className="text-gray-400 ml-1" />
      </div>
    </Tooltip>
  );
}

export default DataTypeToggle;
