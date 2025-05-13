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
import { StandardizedVariable, StandardizedVariableConfigCollection } from '../utils/types';
import DescriptionEditor from './DescriptionEditor';

interface ColumnAnnotationCardProps {
  id: string;
  header: string;
  description: string | null;
  dataType: 'Categorical' | 'Continuous' | null;
  standardizedVariable: StandardizedVariable | null;
  standardizedVariableOptions: StandardizedVariableConfigCollection;
  onDescriptionChange: (columnId: string, newDescription: string | null) => void;
  onDataTypeChange: (columnId: string, newDataType: 'Categorical' | 'Continuous' | null) => void;
  onStandardizedVariableChange: (
    columnId: string,
    newStandardizedVariable: StandardizedVariable | null
  ) => void;
}

function ColumnAnnotationCard({
  id,
  header,
  description,
  dataType,
  standardizedVariable,
  standardizedVariableOptions,
  onDescriptionChange,
  onDataTypeChange,
  onStandardizedVariableChange,
}: ColumnAnnotationCardProps) {
  const handleDataTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newDataType: 'Categorical' | 'Continuous' | null
  ) => {
    onDataTypeChange(id, newDataType);
  };

  const handleStandardizedVariableChange = (
    _: React.ChangeEvent<unknown>,
    newValue: string | null
  ) => {
    const newStandardizedVariable = newValue
      ? Object.values(standardizedVariableOptions).find((sv) => sv.label === newValue) || null
      : null;

    onStandardizedVariableChange(id, newStandardizedVariable);
  };

  const isDataTypeDisabled =
    !!standardizedVariable &&
    Object.values(standardizedVariableOptions).some(
      (option) => option.identifier === standardizedVariable.identifier
    );

  return (
    <Card data-cy={`${id}-column-annotation-card`} className="mx-auto w-full max-w-5xl shadow-lg">
      <CardHeader title={header} className="bg-gray-50" />
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
              {!isDataTypeDisabled ? (
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
                  {dataType || 'Not applicable'}{' '}
                  <Tooltip
                    sx={{ fontSize: '1.2rem' }}
                    placement="right"
                    title={
                      'Data type is automatically determined by standardized variable selection \n' +
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
              value={standardizedVariable?.label || ''}
              onChange={handleStandardizedVariableChange}
              options={Object.values(standardizedVariableOptions).map((value) => value.label)}
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
