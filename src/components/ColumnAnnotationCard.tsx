import { useDraggable, useDroppable } from '@dnd-kit/core';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
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
  termTooltip?: string | null;
  selected?: boolean;
  hideDescription?: boolean;
  onChipClick?: (id: string) => void;
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
  standardizedVariableLabel,
  term,
  termLabel,
  termTooltip,
  selected = false,
  hideDescription = false,
  onChipClick,
  onClick,
  onDescriptionChange,
  onDataTypeChange,
  onStandardizedVariableChange,
}: ColumnAnnotationCardProps & { standardizedVariableLabel?: string | null }) {
  const selectedOption =
    standardizedVariableId !== null
      ? standardizedVariableOptions.find((option) => option.id === standardizedVariableId) || null
      : null;

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `card-drop-${id}`,
    data: { type: 'card', id },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    isDragging,
  } = useDraggable({
    id: `card-drag-${id}`,
    data: { type: 'card', id },
  });

  return (
    <div
      ref={(node) => {
        setDroppableRef(node);
        setDraggableRef(node);
      }}
      data-cy={`${id}-column-annotation-card`}
      onClick={onClick}
      {...attributes}
      {...listeners}
      className={`select-none w-full rounded-lg border shadow-sm transition-all duration-200 ${
        selected
          ? 'bg-blue-50 border-blue-400 shadow-md ring-1 ring-blue-300'
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow'
      } ${isOver ? 'ring-2 ring-blue-500 ring-offset-1 bg-blue-50/50' : ''} ${
        isDragging ? 'opacity-50 ring-2 ring-blue-400 z-50 shadow-lg' : ''
      }`}
      style={{ cursor: isDragging ? 'grabbing' : onClick ? 'pointer' : 'grab' }}
    >
      <div
        className={`w-full px-4 py-2 border-b flex items-center gap-2 justify-between ${selected ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="rounded py-1 px-0.5 -ml-2 text-gray-400 hover:text-gray-700 transition-colors">
            <DragIndicatorIcon fontSize="small" />
          </div>
          <Typography variant="subtitle2" className="font-bold text-gray-900 truncate" title={name}>
            {name}
          </Typography>
        </div>

        <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end">
          {standardizedVariableLabel && (
            <Chip
              label={standardizedVariableLabel}
              size="small"
              color="primary"
              sx={{ fontWeight: 600, cursor: onChipClick ? 'pointer' : 'inherit' }}
              onClick={
                onChipClick && standardizedVariableId
                  ? (e) => {
                      e.stopPropagation();
                      onChipClick(standardizedVariableId);
                    }
                  : undefined
              }
            />
          )}
          {termLabel && (
            <Tooltip title={termTooltip || termLabel} arrow>
              <Chip
                label={termLabel}
                size="small"
                color="secondary"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  backgroundColor: 'white',
                  cursor: onChipClick ? 'pointer' : 'inherit',
                }}
                onClick={
                  onChipClick && term
                    ? (e) => {
                        e.stopPropagation();
                        onChipClick(term);
                      }
                    : undefined
                }
              />
            </Tooltip>
          )}
        </div>
      </div>

      <div
        className={`grid ${hideDescription ? 'grid-cols-[1fr_3fr] md:grid-cols-[1fr_4fr]' : 'grid-cols-[6fr_1fr_3fr]'} gap-4 px-4 py-3 items-center`}
      >
        {!hideDescription && (
          <div
            className="w-full min-w-0"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <DescriptionEditor
              description={description}
              onDescriptionChange={onDescriptionChange}
              columnID={id}
            />
          </div>
        )}

        <div
          className="flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
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
