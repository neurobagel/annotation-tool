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
import { useEffect } from 'react';
import { useTablePagination } from '../hooks';
import DescriptionEditor from './DescriptionEditor';

interface CategoricalProps {
  columnID: string;
  uniqueValues: string[];
  levels: { [key: string]: { description: string } };
  onUpdateDescription: (columnId: string, value: string, description: string) => void;
}

function Categorical({
  columnID: columnId,
  uniqueValues,
  levels,
  onUpdateDescription,
}: CategoricalProps) {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } =
    useTablePagination(5);

  useEffect(() => {
    setPage(0);
  }, [columnId, setPage]);

  const slicedValues = uniqueValues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer
      data-cy={`${columnId}-categorical`}
      component={Paper}
      elevation={3}
      className="h-full shadow-lg"
    >
      <Table className="min-w-[768px]">
        <TableHead data-cy={`${columnId}-categorical-table-head`}>
          <TableRow className="bg-blue-50">
            <TableCell align="left" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Value
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Description
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {slicedValues.map((value) => (
            <TableRow key={value} data-cy={`${columnId}-${value}`}>
              <TableCell align="left">{value}</TableCell>
              <TableCell align="left">
                <DescriptionEditor
                  columnID={columnId}
                  levelValue={value}
                  description={levels[value]?.description || ''}
                  onDescriptionChange={(id, description) => {
                    onUpdateDescription(id, value, description || '');
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        data-cy={`${columnId}-categorical-pagination`}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={uniqueValues.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

export default Categorical;
