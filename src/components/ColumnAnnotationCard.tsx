import HelpIcon from '@mui/icons-material/Help';
import {
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  Tooltip,
  TextField,
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
      className="w-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="w-full bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center">
        <Typography variant="subtitle2" className="font-bold text-gray-900 truncate" title={name}>
          {name}
        </Typography>
      </div>

      <div className="grid grid-cols-[6fr_1fr_3fr] gap-4 px-4 py-3 items-center">
        <div className="w-full min-w-0">
          <DescriptionEditor
            description={description}
            onDescriptionChange={onDescriptionChange}
            columnID={id}
          />
        </div>

        <div className="flex-shrink-0">
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

        <div className="flex-shrink-0 w-full">
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
