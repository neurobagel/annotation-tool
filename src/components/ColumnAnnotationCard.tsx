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
import { DataType } from 'datamodel';
import DescriptionEditor from './DescriptionEditor';

interface ColumnAnnotationCardProps {
  id: string;
  name: string;
  description: string | null;
  dataType: DataType | null;
  standardizedVariableLabel: string | null;
  standardizedVariableOptions: string[];
  isDataTypeEditable: boolean;
  disabledStandardizedVariableLabels: Set<string>;
  onDescriptionChange: (columnId: string, newDescription: string | null) => void;
  onDataTypeChange: (columnId: string, newDataType: 'Categorical' | 'Continuous' | null) => void;
  onStandardizedVariableChange: (columnId: string, newLabel: string | null) => void;
}

function ColumnAnnotationCard({
  id,
  name,
  description,
  dataType,
  standardizedVariableLabel,
  standardizedVariableOptions,
  isDataTypeEditable,
  disabledStandardizedVariableLabels,
  onDescriptionChange,
  onDataTypeChange,
  onStandardizedVariableChange,
}: ColumnAnnotationCardProps) {
  // No hooks! Pure controlled component
  // TODO: think of what to call this, since it doesn't receive
  // VariableType in the strict sense - it's more like a BIDSType
  const handleDataTypeChange = (_: React.MouseEvent<HTMLElement>, newDataType: DataType | null) => {
    onDataTypeChange(id, newDataType);
  };

  const handleStandardizedVariableChange = (
    _: React.ChangeEvent<unknown>,
    newValue: string | null
  ) => {
    onStandardizedVariableChange(id, newValue);
  };

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
                  onChange={handleDataTypeChange}
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
                  {dataType}
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
              value={standardizedVariableLabel || ''}
              onChange={handleStandardizedVariableChange}
              options={standardizedVariableOptions}
              getOptionDisabled={(option) => disabledStandardizedVariableLabels.has(option)}
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
