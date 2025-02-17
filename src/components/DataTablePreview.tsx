import { useState } from 'react';
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
import { DataTable, Columns } from '../utils/types';

function DataTablePreview({ dataTable, columns }: { dataTable: DataTable; columns: Columns }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Define a type for the column object
  type Column = { header: string };

  // Use the Column type in the map function
  const headers = Object.values(columns).map((column: Column) => column.header);
  const rows = Object.values(dataTable);

  const slicedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="mt-6">
      <TableContainer component={Paper} elevation={3} className="w-full overflow-x-auto shadow-lg">
        <Table className="min-w-[768px]" data-cy="data-table">
          <TableHead>
            <TableRow className="bg-blue-50">
              {headers.map((header) => (
                <TableCell
                  key={uuidv4()} // Use uuid for key
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
              const rowId = uuidv4(); // Generate a unique ID for the row
              return (
                <TableRow key={rowId}>
                  {row.map((cell) => {
                    const cellId = uuidv4(); // Generate a unique ID for the cell
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
          count={rows.length}
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
