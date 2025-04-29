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
import MissingValueButton from './MissingValueButton';

interface CategoricalProps {
  columnID: string;
  uniqueValues: string[];
  levels: { [key: string]: { description: string } };
  missingValues: string[];
  onUpdateDescription: (columnID: string, value: string, description: string) => void;
  onToggleMissingValue: (columnID: string, value: string, isMissing: boolean) => void;
}

function Categorical({
  columnID,
  uniqueValues,
  levels,
  missingValues,
  onUpdateDescription,
  onToggleMissingValue,
}: CategoricalProps) {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } =
    useTablePagination(5);

  useEffect(() => {
    setPage(0);
  }, [columnID, setPage]);

  const slicedValues = uniqueValues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <TableContainer
      data-cy={`${columnID}-categorical`}
      component={Paper}
      elevation={3}
      className="h-full shadow-lg"
    >
      <Table className="min-w-[768px]">
        <TableHead data-cy={`${columnID}-categorical-table-head`}>
          <TableRow className="bg-blue-50">
            <TableCell
              align="left"
              sx={{ fontWeight: 'bold', color: 'primary.main', width: '15%' }}
            >
              Value
            </TableCell>
            <TableCell
              align="left"
              sx={{ fontWeight: 'bold', color: 'primary.main', width: '60%' }}
            >
              Description
            </TableCell>
            <TableCell
              align="left"
              sx={{ fontWeight: 'bold', color: 'primary.main', width: '25%' }}
            >
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {slicedValues.map((value) => (
            <TableRow key={value} data-cy={`${columnID}-${value}`}>
              <TableCell align="left">{value}</TableCell>
              <TableCell align="left">
                <DescriptionEditor
                  columnID={columnID}
                  levelValue={value}
                  description={levels[value]?.description || ''}
                  onDescriptionChange={(id, description) => {
                    onUpdateDescription(id, value, description || '');
                  }}
                />
              </TableCell>
              <TableCell align="left">
                <MissingValueButton
                  value={value}
                  columnId={columnID}
                  missingValues={missingValues}
                  onToggleMissingValue={onToggleMissingValue}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center">
        <TablePagination
          data-cy={`${columnID}-categorical-pagination`}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={uniqueValues.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </TableContainer>
  );
}

export default Categorical;
