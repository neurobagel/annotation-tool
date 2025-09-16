import { ArrowUpward, ArrowDownward, FilterList } from '@mui/icons-material';
import { TableCell, IconButton, Tooltip } from '@mui/material';

/* ----------  Value header cell with sort arrows  ---------- */
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

/* ----------  Status header cell with FilterList icon  ---------- */
interface StatusFilterCellProps {
  filterMissing: boolean;
  onToggle: () => void;
  width?: string | number;
  dataCy?: string;
}

function StatusFilterCell({
  filterMissing,
  onToggle,
  width,
  dataCy = 'filter-status-button',
}: StatusFilterCellProps) {
  return (
    <TableCell
      align="left"
      sx={{
        fontWeight: 'bold',
        color: 'primary.main',
        width: width ?? undefined,
      }}
    >
      Status
      <Tooltip title={filterMissing ? 'Show all values' : 'Show only missing'}>
        <IconButton
          data-cy={dataCy}
          size="small"
          color={filterMissing ? 'primary' : 'default'}
          onClick={onToggle}
        >
          <FilterList fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </TableCell>
  );
}

ValueSortCell.defaultProps = defaultProps;
StatusFilterCell.defaultProps = defaultProps;
export { ValueSortCell, StatusFilterCell };
