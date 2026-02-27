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
  selected?: boolean;
  onSelect?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const defaultProps = {
  selected: false,
  onSelect: undefined,
};

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
  selected = false,
  onSelect,
}: ColumnAnnotationCardProps) {
  const selectedOption =
    standardizedVariableId !== null
      ? standardizedVariableOptions.find((option) => option.id === standardizedVariableId) || null
      : null;

  return (
    // The jsx-a11y linter expects any element with role="button" and an onClick handler
    // to be fully accessible via keyboard (requiring a tabIndex and an onKeyDown handler).
    // We intentionally omit these keyboard/focus handlers so the card itself doesn't
    // become a tab stop, allowing users to naturally tab through the interactive elements
    // *inside* the card instead.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus, jsx-a11y/role-supports-aria-props
    <div
      role="button"
      aria-selected={selected}
      data-cy={`${id}-column-annotation-card`}
      className={`w-full rounded-lg transition-all duration-200 cursor-pointer ${
        selected
          ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500 shadow-md'
          : 'bg-white border-gray-200 border shadow-sm hover:shadow-md'
      }`}
      onClick={onSelect}
    >
      <div
        className={`w-full px-4 py-2 border-b flex items-center select-none ${
          selected ? 'bg-blue-100/50 border-blue-200' : 'bg-gray-50 border-gray-200'
        }`}
      >
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

ColumnAnnotationCard.defaultProps = defaultProps;

export default ColumnAnnotationCard;
