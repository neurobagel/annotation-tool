import { useDraggable, useDroppable } from '@dnd-kit/core';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import HelpIcon from '@mui/icons-material/Help';
import { Typography, Tooltip, Chip } from '@mui/material';
import { DataType } from '~/utils/internal_types';
import DescriptionEditor from './DescriptionEditor';

interface MockColumnAnnotationCardProps {
  id: string;
  name: string;
  description: string | null;
  dataType: DataType | null;
  standardizedVariableId: string | null;
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
  onRemoveVariable?: (columnId: string) => void;
  onRemoveTerm?: (columnId: string) => void;
}

function MockColumnAnnotationCard({
  id,
  name,
  description,
  dataType,
  standardizedVariableId,
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
  onRemoveVariable,
  onRemoveTerm,
}: MockColumnAnnotationCardProps & { standardizedVariableLabel?: string | null }) {
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
      className={`group select-none w-full rounded-lg border shadow-sm transition-all duration-200 ${
        selected
          ? 'bg-blue-50 border-blue-400 shadow-md ring-1 ring-blue-300'
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow'
      } ${isOver ? 'ring-2 ring-blue-500 ring-offset-1 bg-blue-50/50' : ''} ${
        isDragging ? 'opacity-50 ring-2 ring-blue-400 z-50 shadow-lg' : ''
      }`}
      style={{ cursor: isDragging ? 'grabbing' : onClick ? 'pointer' : 'grab' }}
    >
      <div
        className={`w-full px-4 py-2 flex items-center gap-4 justify-between transition-colors ${
          selected ? 'bg-blue-50/50' : 'bg-transparent'
        }`}
      >
        {/* LEFT: Drag Handle & Title */}
        <div className="flex items-center gap-2 min-w-[200px] w-1/4">
          <div className="rounded py-1 px-0.5 -ml-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-700 transition-all">
            <DragIndicatorIcon fontSize="small" />
          </div>
          <Typography variant="subtitle2" className="font-bold text-gray-900 truncate" title={name}>
            {name}
          </Typography>
        </div>

        {/* MIDDLE: Description Input */}
        {!hideDescription && (
          <div
            className="flex-1 min-w-[200px]"
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

        {/* RIGHT: Chips (Standard Variable, Term, Data Type) */}
        <div className="flex gap-1 flex-shrink-0 flex-wrap justify-end min-w-[200px] w-1/3">
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
              onDelete={
                onRemoveVariable
                  ? (e) => {
                      e.stopPropagation();
                      onRemoveVariable(id);
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
                onDelete={
                  onRemoveTerm
                    ? (e) => {
                        e.stopPropagation();
                        onRemoveTerm(id);
                      }
                    : undefined
                }
              />
            </Tooltip>
          )}

          {(dataType || inferredDataTypeLabel) && (
            <Tooltip
              title={
                !isDataTypeEditable
                  ? 'Data type is automatically determined by standardized variable selection. To change the data type manually, remove the standardized variable.'
                  : ''
              }
              arrow
              disableHoverListener={isDataTypeEditable}
            >
              <Chip
                label={inferredDataTypeLabel || dataType}
                size="small"
                color="default"
                sx={{
                  fontWeight: 600,
                  backgroundColor: isDataTypeEditable ? '#e0e0e0' : '#f5f5f5',
                  color: isDataTypeEditable ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.38)',
                  cursor: isDataTypeEditable ? 'pointer' : 'not-allowed',
                }}
                onDelete={
                  isDataTypeEditable && dataType !== null
                    ? (e) => {
                        e.stopPropagation();
                        onDataTypeChange(id, null);
                      }
                    : undefined
                }
                deleteIcon={
                  !isDataTypeEditable ? (
                    <HelpIcon sx={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.26)' }} />
                  ) : undefined
                }
              />
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}

export default MockColumnAnnotationCard;
