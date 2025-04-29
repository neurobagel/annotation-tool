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

interface ContinuousProps {
  columnID: string;
  units: string;
  columnValues: string[];
  missingValues: string[];
  onUpdateUnits: (columnID: string, units: string) => void;
  onToggleMissingValue: (columnID: string, value: string, isMissing: boolean) => void;
}

function Continuous({
  columnID,
  units,
  columnValues,
  missingValues,
  onUpdateUnits,
  onToggleMissingValue,
}: ContinuousProps) {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } =
    useTablePagination(5);

  const uniqueValues = Array.from(new Set(columnValues));
  const slicedValues = uniqueValues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    setPage(0);
  }, [columnID, setPage]);

  return (
    <Paper elevation={3} className="h-full shadow-lg" data-cy={`${columnID}-continuous`}>
      <div className="flex h-full">
        <div className="w-3/5 flex flex-col">
          <TableContainer className="flex-1">
            <Table stickyHeader>
              <TableHead>
                <TableRow className="bg-blue-50">
                  <TableCell
                    align="left"
                    sx={{ fontWeight: 'bold', color: 'primary.main', width: '70%' }}
                  >
                    Value
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ fontWeight: 'bold', color: 'primary.main', width: '30%' }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slicedValues.map((value) => (
                  <TableRow key={value}>
                    <TableCell align="left">{value}</TableCell>
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
          </TableContainer>
          <TablePagination
            className="flex justify-center"
            data-cy={`${columnID}-continuous-pagination`}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            component="div"
            count={uniqueValues.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>

        <div className="w-2/5 p-4">
          <DescriptionEditor
            key={columnID}
            label="Units"
            columnID={columnID}
            description={units}
            onDescriptionChange={(id, newUnits) => {
              onUpdateUnits(id, newUnits || '');
            }}
          />
        </div>
      </div>
    </Paper>
  );
}

export default Continuous;
