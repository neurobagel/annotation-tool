import HelpIcon from '@mui/icons-material/Help';
import {
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  Tooltip,
  TextField,
  Chip,
} from '@mui/material';
import { DataType } from '~/utils/internal_types';
import { StandardizedVariableOption } from '../hooks/useStandardizedVariableOptions';
import DescriptionEditor from './DescriptionEditor';

interface ColumnAnnotationCardProps {
  id: string;
  name: string;
  description: string | null;
  dataType: DataType | null;
  standardizedVariableId: string | null;
  standardizedVariableOptions: StandardizedVariableOption[];
  isDataTypeEditable: boolean;
  inferredDataTypeLabel: string | null;
  term?: string | null;
  termLabel?: string | null;
  selected?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDescriptionChange: (columnId: string, newDescription: string | null) => void;
  onDataTypeChange: (columnId: string, newDataType: 'Categorical' | 'Continuous' | null) => void;
  onStandardizedVariableChange: (columnId: string, newId: string | null) => void;
}

function ColumnAnnotationCard({
  id,
  name,
  description,
  dataType,
  standardizedVariableId,
  standardizedVariableOptions,
  isDataTypeEditable,
  inferredDataTypeLabel,
  termLabel,
  selected = false,
  onClick,
  onDescriptionChange,
  onDataTypeChange,
  onStandardizedVariableChange,
}: ColumnAnnotationCardProps) {
  const selectedOption =
    standardizedVariableId !== null
      ? standardizedVariableOptions.find((option) => option.id === standardizedVariableId) || null
      : null;

  return (
    <div
      data-cy={`${id}-column-annotation-card`}
      onClick={onClick}
      className={`select-none w-full rounded-lg border shadow-sm transition-all duration-200 ${selected ? 'bg-blue-50 border-blue-400 shadow-md ring-1 ring-blue-300' : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow'
        }`}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className={`w-full px-4 py-2 border-b flex items-center justify-between ${selected ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
        <Typography variant="subtitle2" className="font-bold text-gray-900 truncate" title={name}>
          {name}
        </Typography>
        {termLabel && (
          <Chip label={termLabel} size="small" color="primary" variant="outlined" />
        )}
      </div>

      <div className="grid grid-cols-[6fr_1fr_3fr] gap-4 px-4 py-3 items-center">
        <div className="w-full min-w-0" onClick={(e) => e.stopPropagation()}>
          <DescriptionEditor
            description={description}
            onDescriptionChange={onDescriptionChange}
            columnID={id}
          />
        </div>

        <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {isDataTypeEditable ? (
            <ToggleButtonGroup
              data-cy={`${id}-column-annotation-card-data-type`}
              value={dataType}
              onChange={(_, newDataType) => onDataTypeChange(id, newDataType)}
              exclusive
              color="primary"
              size="small"
              className="shadow-sm w-full flex h-10"
            >
              <Tooltip title="Categorical" arrow>
                <ToggleButton
                  data-cy={`${id}-column-annotation-card-data-type-categorical-button`}
                  value="Categorical"
                  className="px-2 flex-1 w-1/2"
                >
                  <span className="text-xs font-semibold">Cat.</span>
                </ToggleButton>
              </Tooltip>

              <Tooltip title="Continuous" arrow>
                <ToggleButton
                  data-cy={`${id}-column-annotation-card-data-type-continuous-button`}
                  value="Continuous"
                  className="px-2 flex-1 w-1/2"
                >
                  <span className="text-xs font-semibold">Cont.</span>
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
          ) : (
            <Tooltip
              title={
                'Data type is automatically determined by standardized variable selection. \n' +
                ' To change the data type manually, remove the standardized variable'
              }
              arrow
            >
              <div
                className="h-10 px-2 flex items-center justify-center border rounded border-gray-200 bg-gray-50/50 text-gray-500 cursor-not-allowed w-full shadow-sm"
                data-cy={`${id}-column-annotation-card-data-type`}
                tabIndex={0}
                role="button"
              >
                <Typography variant="caption" className="font-medium truncate">
                  {inferredDataTypeLabel || dataType || 'Unknown'}
                </Typography>
                <HelpIcon sx={{ fontSize: 14 }} className="text-gray-400 ml-1" />
              </div>
            </Tooltip>
          )}
        </div>

        <div className="flex-shrink-0 w-full" onClick={(e) => e.stopPropagation()}>
          <Autocomplete
            data-cy={`${id}-column-annotation-card-standardized-variable-dropdown`}
            value={selectedOption}
            onChange={(_, newValue) => onStandardizedVariableChange(id, newValue?.id ?? null)}
            options={standardizedVariableOptions}
            getOptionDisabled={(option) => option.disabled}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            size="small"
            renderInput={(params) => (
              <TextField
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...params}
                variant="outlined"
                placeholder="Select variable"
                className="w-full bg-white"
                size="small"
              />
            )}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}

export default ColumnAnnotationCard;
