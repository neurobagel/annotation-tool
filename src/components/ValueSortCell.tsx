import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { TableCell } from '@mui/material';

const defaultProps = {
  width: '',
  dataCy: '',
};

interface ValueSortCellProps {
  sortDir: 'asc' | 'desc';
  onToggle: () => void;
  width?: string | number;
  dataCy?: string;
}

function ValueSortCell({
  sortDir,
  onToggle,
  width,
  dataCy = 'sort-values-button',
}: ValueSortCellProps) {
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
      Value
      {sortDir === 'asc' ? (
        <ArrowUpward fontSize="inherit" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
      ) : (
        <ArrowDownward fontSize="inherit" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
      )}
    </TableCell>
  );
}

ValueSortCell.defaultProps = defaultProps;
export default ValueSortCell;
