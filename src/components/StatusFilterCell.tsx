import { FilterList } from '@mui/icons-material';
import { TableCell, IconButton, Tooltip } from '@mui/material';

const defaultProps = {
  width: '',
  dataCy: '',
};

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

StatusFilterCell.defaultProps = defaultProps;
export default StatusFilterCell;
