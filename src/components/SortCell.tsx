import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { TableCell } from '@mui/material';

const defaultProps = {
  width: '',
  dataCy: '',
};

interface SortCellProps {
  label: string;
  sortDir: 'asc' | 'desc';
  onToggle: () => void;
  width?: string | number;
  dataCy?: string;
}

function SortCell({ label, sortDir, onToggle, width, dataCy }: SortCellProps) {
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
      {sortDir === 'asc' ? (
        <ArrowUpward fontSize="inherit" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
      ) : (
        <ArrowDownward fontSize="inherit" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
      )}
      {label}
    </TableCell>
  );
}

SortCell.defaultProps = defaultProps;
export default SortCell;
