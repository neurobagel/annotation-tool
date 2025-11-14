import CancelIcon from '@mui/icons-material/Cancel';
import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { VariableColumnSummary } from '../types/multiColumnMeasureTypes';
import { getColumnsAssignedText } from '../utils/util';

interface MultiColumnMeasuresColumnsSidebarProps {
  variableName: string;
  columns: VariableColumnSummary[];
  mappedColumnIds: string[];
  onUnassignColumn: (columnId: string) => void;
}

function MultiColumnMeasuresColumnsSidebar({
  variableName,
  columns,
  mappedColumnIds,
  onUnassignColumn,
}: MultiColumnMeasuresColumnsSidebarProps) {
  const theme = useTheme();

  return (
    <Card className="w-full shadow-lg" elevation={3} data-cy="multi-column-measures-columns-card">
      <CardHeader className="bg-gray-50" title={`${variableName}: all columns`} />
      <CardContent className="text-center">
        <div className="max-h-[500px] overflow-auto">
          {columns.map(({ id, header }) => (
            <div key={id} className="p-2 border-b flex items-center justify-between">
              <Typography
                sx={{
                  color: mappedColumnIds.includes(id) ? theme.palette.primary.main : 'inherit',
                }}
              >
                {header}
              </Typography>
              <CancelIcon
                sx={{
                  fontSize: 16,
                  color: theme.palette.grey[500],
                  cursor: 'pointer',
                  '&:hover': {
                    color: theme.palette.error.main,
                  },
                }}
                onClick={() => onUnassignColumn(id)}
                data-cy={`unassign-column-${id}`}
              />
            </div>
          ))}
        </div>
        <Typography variant="body2" className="mt-8">
          {getColumnsAssignedText(mappedColumnIds.length)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default MultiColumnMeasuresColumnsSidebar;
