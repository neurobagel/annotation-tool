import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Fab,
  Autocomplete,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { StandardizedVarible, StandardizedVaribles } from '../utils/types';

interface ColumnAnnotationCardProps {
  id: number;
  header: string;
  description: string | null;
  dataType: 'Categorical' | 'Continuous' | null;
  standardizedVariable: StandardizedVarible | null;
  standardizedVariableOptions: StandardizedVaribles;
  onDescriptionChange: (columnId: number, newDescription: string | null) => void;
  onDataTypeChange: (columnId: number, newDataType: 'Categorical' | 'Continuous' | null) => void;
  onStandardizedVariableChange: (
    columnId: number,
    newStandardizedVariable: StandardizedVarible | null
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
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState<string | null>(description);
  const [selectedDataType, setSelectedDataType] = useState<'Categorical' | 'Continuous' | null>(
    dataType
  );
  const [selectedStandardizedVariableKey, setSelectedStandardizedVariableKey] = useState<
    string | null
  >(standardizedVariable ? standardizedVariable.identifier : null);

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleSaveDescription = () => {
    setIsEditingDescription(false);
    onDescriptionChange(id, editedDescription);
  };

  const handleDataTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newDataType: 'Categorical' | 'Continuous' | null
  ) => {
    setSelectedDataType(newDataType);
    onDataTypeChange(id, newDataType);
  };

  const handleStandardizedVariableChange = (
    _: React.ChangeEvent<unknown>,
    newValue: string | null
  ) => {
    setSelectedStandardizedVariableKey(newValue);
    const newStandardizedVariable = newValue ? standardizedVariableOptions[newValue] : null;
    onStandardizedVariableChange(id, newStandardizedVariable);
  };

  return (
    <Card data-cy={`${id}-column-annotation-card`} className="mx-auto w-full max-w-5xl shadow-lg">
      <CardHeader title={header} className="bg-gray-50" />
      <CardContent>
        {isEditingDescription ? (
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <TextField
              data-cy={`${id}-column-annotation-card-description-input`}
              fullWidth
              multiline
              rows={3}
              value={editedDescription || ''}
              onChange={(e) => setEditedDescription(e.target.value)}
              variant="outlined"
              label="Description"
              className="flex-1"
            />
            <Fab
              data-cy={`${id}-column-annotation-card-save-description-button`}
              color="secondary"
              aria-label="save"
              onClick={handleSaveDescription}
              size="small"
              className="mt-4 md:mt-0"
            >
              <SaveIcon />
            </Fab>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="flex-1">
              <Typography variant="subtitle1" className="mb-2 text-gray-700">
                Description:
              </Typography>
              <Typography
                data-cy={`${id}-column-annotation-card-description`}
                variant="body1"
                className="text-gray-700"
              >
                {description || 'No description provided.'}
              </Typography>
            </div>
            <Fab
              data-cy={`${id}-column-annotation-card-edit-description-button`}
              color="primary"
              aria-label="edit"
              onClick={handleEditDescription}
              size="small"
              className="mt-4 md:mt-0"
            >
              <EditIcon />
            </Fab>
          </div>
        )}

        <div className="mt-4 flex flex-col items-center gap-4 md:flex-row">
          <div className="flex flex-1 flex-col">
            <Typography variant="subtitle1" className="mb-2 text-gray-700">
              Data Type:
            </Typography>
            <ToggleButtonGroup
              data-cy={`${id}-column-annotation-card-data-type`}
              value={selectedDataType}
              onChange={handleDataTypeChange}
              exclusive
              aria-label="data type"
              color="primary"
            >
              <ToggleButton
                data-cy={`${id}-column-annotation-card-data-type-categorical-button`}
                value="Categorical"
                aria-label="categorical"
              >
                Categorical
              </ToggleButton>
              <ToggleButton
                data-cy={`${id}-column-annotation-card-data-type-continuous-button`}
                value="Continuous"
                aria-label="continuous"
              >
                Continuous
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          <div className="flex flex-1 flex-col">
            <Typography variant="subtitle1" className="mb-2 text-gray-700">
              Standardized Variable:
            </Typography>
            <Autocomplete
              data-cy={`${id}-column-annotation-card-standardized-variable-dropdown`}
              value={selectedStandardizedVariableKey}
              onChange={handleStandardizedVariableChange}
              options={Object.keys(standardizedVariableOptions)}
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
