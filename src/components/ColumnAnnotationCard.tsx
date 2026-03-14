import { Typography, Tooltip, Box } from '@mui/material';
import { DataType } from '~/utils/internal_types';
import { StandardizedVariableOption } from '../hooks/useStandardizedVariableOptions';
import DataTypeDisplay from './DataTypeDisplay';
import DescriptionEditor from './DescriptionEditor';

interface ColumnAnnotationCardProps {
  id: string;
  name: string;
  description: string | null;
  dataType: DataType | null;
  standardizedVariableId: string | null;
  termLabel?: string | null;
  termAbbreviation?: string | null;
  standardizedVariableOptions: StandardizedVariableOption[];
  inferredDataTypeLabel: string | null;
  onDescriptionChange: (columnId: string, newDescription: string | null) => void;
  selected?: boolean;
  onSelect: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const defaultProps = {
  selected: false,
  termLabel: null,
  termAbbreviation: null,
};

function ColumnAnnotationCard({
  id,
  name,
  description,
  dataType,
  standardizedVariableId,
  termLabel,
  termAbbreviation,
  standardizedVariableOptions,
  inferredDataTypeLabel,
  onDescriptionChange,
  selected,
  onSelect,
}: ColumnAnnotationCardProps) {
  const mappedStandardizedVariable =
    standardizedVariableId !== null
      ? standardizedVariableOptions.find((option) => option.id === standardizedVariableId) || null
      : null;

  let dataTypeLabel = inferredDataTypeLabel || dataType;
  if (dataTypeLabel === DataType.categorical) {
    dataTypeLabel = 'Categorical';
  } else if (dataTypeLabel === DataType.continuous) {
    dataTypeLabel = 'Continuous';
  }

  // Prefix the term label with the variable label so that when the full text is
  // displayed as a hover-tooltip, it provides clear context for the term.
  const displayFullText =
    [mappedStandardizedVariable?.label, termLabel].filter(Boolean).join(': ') || null;

  const displayAbbrText =
    [mappedStandardizedVariable?.label, termAbbreviation].filter(Boolean).join(': ') || null;

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
          <DataTypeDisplay
            columnId={id}
            label={dataTypeLabel}
            isInferred={!!inferredDataTypeLabel}
          />
        </div>

        <div className="flex-shrink-0 w-full">
          {displayFullText ? (
            <Tooltip title={displayFullText} arrow placement="top">
              <Box
                bgcolor="primary.main"
                color="primary.contrastText"
                className="h-10 px-3 flex items-center justify-start rounded w-fit max-w-full shadow-sm"
                data-cy={`${id}-column-annotation-card-mapped-variable`}
              >
                <Typography variant="body2" className="font-medium truncate">
                  {displayAbbrText}
                </Typography>
              </Box>
            </Tooltip>
          ) : (
            <div
              className="h-10 px-3 flex items-center justify-start text-gray-400 w-full"
              data-cy={`${id}-column-annotation-card-mapped-variable-unassigned`}
            >
              <Typography variant="body2" className="italic font-medium">
                Map to standardized variable
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ColumnAnnotationCard.defaultProps = defaultProps;

export default ColumnAnnotationCard;
