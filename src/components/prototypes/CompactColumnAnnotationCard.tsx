import HelpIcon from '@mui/icons-material/Help';
import {
  Card,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  Tooltip,
  TextField,
} from '@mui/material';
import { DataType } from '~/utils/internal_types';
import { StandardizedVariableOption } from '../../hooks/useStandardizedVariableOptions';
import CompactDescriptionEditor from './CompactDescriptionEditor';

interface CompactColumnAnnotationCardProps {
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

function CompactColumnAnnotationCard({
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
}: CompactColumnAnnotationCardProps) {
  const selectedOption =
    standardizedVariableId !== null
      ? standardizedVariableOptions.find((option) => option.id === standardizedVariableId) || null
      : null;

  return (
    <Card
      data-cy={`${id}-column-annotation-card`}
      className="mx-auto w-full max-w-5xl shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center p-3 gap-3">
        {/* Title Section - fixed width on desktop */}
        <div className="flex-shrink-0 lg:w-48 font-bold text-gray-800 break-words" title={name}>
          <Typography variant="body1" className="font-bold leading-tight">
            {name}
          </Typography>
        </div>

        {/* Description Section - grows to fill space */}
        <div className="flex-grow w-full lg:w-auto">
          <CompactDescriptionEditor
            description={description}
            onDescriptionChange={onDescriptionChange}
            columnID={id}
          />
        </div>

        {/* Controls Section - keeps Data Type and Variable together */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-center flex-shrink-0">
          {/* Data Type */}
          <div className="flex-shrink-0">
            {isDataTypeEditable ? (
              <ToggleButtonGroup
                data-cy={`${id}-column-annotation-card-data-type`}
                value={dataType}
                onChange={(_, newDataType) => onDataTypeChange(id, newDataType)}
                exclusive
                color="primary"
                size="small"
                className="h-10"
              >
                <ToggleButton
                  data-cy={`${id}-column-annotation-card-data-type-categorical-button`}
                  value="Categorical"
                  className="px-3"
                >
                  Categorical
                </ToggleButton>
                <ToggleButton
                  data-cy={`${id}-column-annotation-card-data-type-continuous-button`}
                  value="Continuous"
                  className="px-3"
                >
                  Continuous
                </ToggleButton>
              </ToggleButtonGroup>
            ) : (
              <div
                className="h-10 px-3 flex items-center border rounded border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                data-cy={`${id}-column-annotation-card-data-type`}
              >
                <Typography variant="body2" className="mr-1">
                  {inferredDataTypeLabel || dataType || 'Unknown'}
                </Typography>
                <Tooltip
                  sx={{ fontSize: '1.2rem' }}
                  placement="top"
                  title={
                    'Data type is automatically determined by standardized variable selection. \n' +
                    ' To change the data type manually, remove the standardized variable'
                  }
                >
                  <HelpIcon fontSize="small" className="text-gray-400" />
                </Tooltip>
              </div>
            )}
          </div>

          {/* Standardized Variable - Fixed width */}
          <div className="w-full sm:w-64 flex-shrink-0">
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
                  className="w-full"
                />
              )}
              fullWidth
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CompactColumnAnnotationCard;
