import { useState, useEffect } from 'react';
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
import DescriptionEditor from './DescriptionEditor';

interface CategoricalProps {
  columnId: string;
  uniqueValues: string[];
  levels: Record<string, { description: string }>;
  onUpdateDescription: (columnId: string, value: string, description: string) => void;
}

function Categorical({ columnId, uniqueValues, levels, onUpdateDescription }: CategoricalProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setPage(0);
  }, [columnId]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const slicedValues = uniqueValues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer component={Paper} elevation={3} className="shadow-lg">
      <Table className="min-w-[768px]">
        <TableHead>
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
            <TableRow key={value}>
              <TableCell align="left">{value}</TableCell>
              <TableCell align="left">
                <DescriptionEditor
                  id={columnId}
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
