import HelpIcon from '@mui/icons-material/Help';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  Tooltip,
} from '@mui/material';
import { DataType } from 'internal_types';
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
    <Card data-cy={`${id}-column-annotation-card`} className="mx-auto w-full max-w-5xl shadow-lg">
      <CardHeader title={name} className="bg-gray-50" />
      <CardContent>
        <DescriptionEditor
          label="Column description"
          description={description}
          onDescriptionChange={onDescriptionChange}
          columnID={id}
        />

        <div className="mt-4 flex flex-col items-center gap-4 md:flex-row">
          <div className="flex flex-1 flex-col">
            <Typography variant="subtitle1" className="mb-2 font-bold text-gray-700">
              Data type
            </Typography>
            <div>
              {isDataTypeEditable ? (
                <ToggleButtonGroup
                  data-cy={`${id}-column-annotation-card-data-type`}
                  value={dataType}
                  onChange={(_, newDataType) => onDataTypeChange(id, newDataType)}
                  exclusive
                  color="primary"
                >
                  <ToggleButton
                    data-cy={`${id}-column-annotation-card-data-type-categorical-button`}
                    value="Categorical"
                  >
                    Categorical
                  </ToggleButton>
                  <ToggleButton
                    data-cy={`${id}-column-annotation-card-data-type-continuous-button`}
                    value="Continuous"
                  >
                    Continuous
                  </ToggleButton>
                </ToggleButtonGroup>
              ) : (
                <Typography variant="body1" data-cy={`${id}-column-annotation-card-data-type`}>
                  {inferredDataTypeLabel || dataType || 'Unknown'}
                  <Tooltip
                    sx={{ fontSize: '1.2rem' }}
                    placement="right"
                    title={
                      'Data type is automatically determined by standardized variable selection. \n' +
                      ' To change the data type manually, remove the standardized variable'
                    }
                  >
                    <HelpIcon fontSize="small" color="primary" />
                  </Tooltip>
                </Typography>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <Typography variant="subtitle1" className="mb-2 font-bold text-gray-700">
              Standardized variable
            </Typography>
            <Autocomplete
              data-cy={`${id}-column-annotation-card-standardized-variable-dropdown`}
              value={selectedOption}
              onChange={(_, newValue) => onStandardizedVariableChange(id, newValue?.id ?? null)}
              options={standardizedVariableOptions}
              getOptionDisabled={(option) => option.disabled}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...params}
                  variant="outlined"
                  placeholder="Select a standardized variable"
                  className="w-full"
                />
              )}
              fullWidth
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ColumnAnnotationCard;
