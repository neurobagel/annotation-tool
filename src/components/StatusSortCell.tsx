import { FilterList } from '@mui/icons-material';
import { TableCell, IconButton, Tooltip } from '@mui/material';

const defaultProps = {
  width: '',
  dataCy: '',
};

interface StatusSortCellProps {
  filterMissing: boolean;
  onToggle: () => void;
  width?: string | number;
  dataCy?: string;
}

function StatusSortCell({
  filterMissing,
  onToggle,
  width,
  dataCy = 'sort-status-button',
}: StatusSortCellProps) {
  return (
    <TableCell
      align="left"
      sx={{
        fontWeight: 'bold',
        color: 'primary.main',
        width: width ?? undefined,
      }}
    >
      Treat as missing value
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

StatusSortCell.defaultProps = defaultProps;
export default StatusSortCell;
