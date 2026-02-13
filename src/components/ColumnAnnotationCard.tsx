import { Typography, Autocomplete, TextField } from '@mui/material';
import { DataType } from '~/utils/internal_types';
import { StandardizedVariableOption } from '../hooks/useStandardizedVariableOptions';
import DataTypeToggle from './DataTypeToggle';
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
          <DataTypeToggle
            columnId={id}
            value={dataType}
            isEditable={isDataTypeEditable}
            inferredLabel={inferredDataTypeLabel}
            onChange={onDataTypeChange}
          />
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
