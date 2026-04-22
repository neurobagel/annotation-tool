import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { TableCell } from '@mui/material';

interface SortCellProps {
  label: string;
  sortDir: 'asc' | 'desc';
  onToggle: () => void;
  width?: string | number;
  dataCy?: string;
  isActive?: boolean;
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
  component?: 'th' | 'td' | 'div';
}

function SortCell({
  label,
  sortDir,
  onToggle,
  width,
  dataCy,
  isActive,
  align = 'left',
  component,
}: SortCellProps) {
  return (
    <TableCell
      component={component}
      data-cy={dataCy}
      align={align}
      sx={{
        fontWeight: 'bold',
        color: 'primary.main',
        cursor: 'pointer',
        width: width ?? undefined,
        flex: width ? 'none' : 1,
      }}
      onClick={onToggle}
    >
      {isActive &&
        (sortDir === 'asc' ? (
          <ArrowUpward sx={{ mr: 0.2, verticalAlign: 'middle', fontSize: '1.2em' }} />
        ) : (
          <ArrowDownward sx={{ mr: 0.22, verticalAlign: 'middle', fontSize: '1.2em' }} />
        ))}
      {label}
    </TableCell>
  );
}

export default SortCell;
