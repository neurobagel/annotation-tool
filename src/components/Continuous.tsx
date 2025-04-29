import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Autocomplete,
  TextField,
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
  format?: {
    termURL?: string;
    label?: string;
  };
  onUpdateUnits: (columnID: string, units: string) => void;
  onToggleMissingValue: (columnID: string, value: string, isMissing: boolean) => void;
  onUpdateFormat: (columnID: string, format: { termURL: string; label: string } | null) => void;
}

const formatOptions = [
  { label: 'bounded', value: 'nb:FromBounded' },
  { label: 'euro', value: 'nb:FromEuro' },
  { label: 'float', value: 'nb:FromFloat' },
  { label: 'iso8601', value: 'nb:FromISO8601' },
  { label: 'range', value: 'nb:FromRange' },
];

function Continuous({
  columnID,
  units,
  columnValues,
  missingValues,
  format,
  onUpdateUnits,
  onToggleMissingValue,
  onUpdateFormat,
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
                {slicedValues.map((value, index) => (
                  <TableRow key={`${columnID}-${value}-${index}`}>
                    <TableCell align="left">{value}</TableCell>
                    <TableCell align="left">
                      <MissingValueButton
                        key={`${columnID}-${value}-${index}-missingButton`}
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

        <div className="w-2/5 p-4 space-y-4">
          <DescriptionEditor
            key={`${columnID}-units`}
            label="Units"
            columnID={columnID}
            description={units}
            onDescriptionChange={(id, newUnits) => {
              onUpdateUnits(id, newUnits || '');
            }}
          />

          <Autocomplete
            options={formatOptions}
            getOptionLabel={(option) => option.label}
            value={formatOptions.find((opt) => opt.value === format?.termURL) || null}
            onChange={(_, newValue) => {
              onUpdateFormat(
                columnID,
                newValue
                  ? {
                      termURL: newValue.value,
                      label: newValue.label,
                    }
                  : null
              );
            }}
            renderInput={(params) => (
              <TextField {...params} label="Format" variant="outlined" fullWidth />
            )}
          />
        </div>
      </div>
    </Paper>
  );
}

export default Continuous;
