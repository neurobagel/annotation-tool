import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { TableCell } from '@mui/material';

const defaultProps = {
  width: '',
  dataCy: '',
  isActive: false,
};

interface SortCellProps {
  label: string;
  sortDir: 'asc' | 'desc';
  onToggle: () => void;
  width?: string | number;
  dataCy?: string;
  isActive?: boolean;
}

function SortCell({ label, sortDir, onToggle, width, dataCy, isActive }: SortCellProps) {
  return (
    <TableCell
      data-cy={dataCy}
      align="left"
      sx={{
        fontWeight: 'bold',
        color: 'primary.main',
        cursor: 'pointer',
        width: width ?? undefined,
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

SortCell.defaultProps = defaultProps;
export default SortCell;
