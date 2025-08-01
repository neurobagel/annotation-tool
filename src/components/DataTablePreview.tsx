import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useTablePagination } from '../hooks';
import { DataTable, Columns, Column } from '../utils/internal_types';

function DataTablePreview({ dataTable, columns }: { dataTable: DataTable; columns: Columns }) {
  const { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage } = useTablePagination(5);

  const headers = Object.values(columns).map((column: Column) => column.header);

  // Transform column-based data into row-based data for rendering
  const rowData =
    Object.keys(dataTable).length > 0
      ? Object.values(dataTable)[0].map((_, rowIndex) =>
          Object.keys(dataTable).map((colKey) => dataTable[colKey][rowIndex])
        )
      : [];

  const slicedRows = rowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="mt-6">
      <TableContainer component={Paper} elevation={3} className="w-full overflow-x-auto shadow-lg">
        <Table className="min-w-[768px]" data-cy="datatable-preview">
          <TableHead>
            <TableRow className="bg-blue-50">
              {headers.map((header) => (
                <TableCell
                  key={uuidv4()}
                  align="left"
                  sx={{ fontWeight: 'bold', color: 'primary.main' }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedRows.map((row) => {
              const rowId = uuidv4();
              return (
                <TableRow key={rowId}>
                  {row.map((cell) => {
                    const cellId = uuidv4();
                    return (
                      <TableCell key={cellId} align="left">
                        {cell}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          data-cy="datatable-preview-pagination"
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={rowData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
}

export default DataTablePreview;
