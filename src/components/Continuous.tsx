import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  TextField,
} from '@mui/material';
import { useEffect } from 'react';
import { StandardizedVariable } from '~/utils/types';
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
  standardizedVariable?: StandardizedVariable | null;
  onUpdateUnits: (columnID: string, units: string) => void;
  onToggleMissingValue: (columnID: string, value: string, isMissing: boolean) => void;
  onUpdateFormat: (columnID: string, format: { termURL: string; label: string } | null) => void;
}

const defaultProps = {
  standardizedVariable: null,
  format: null,
};

const formatOptions = [
  { label: 'euro', value: 'nb:FromEuro' },
  { label: 'bounded', value: 'nb:FromBounded' },
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
  standardizedVariable,
  onUpdateUnits,
  onToggleMissingValue,
  onUpdateFormat,
}: ContinuousProps) {
  const uniqueValues = Array.from(new Set(columnValues));

  useEffect(() => {
    // Reset scroll position when column changes
    const tableContainer = document.getElementById(`${columnID}-table-container`);
    if (tableContainer) {
      tableContainer.scrollTop = 0;
    }
  }, [columnID]);

  return (
    <Paper elevation={3} className="h-full shadow-lg" data-cy={`${columnID}-continuous`}>
      <div className="flex h-full">
        <div className="w-3/5 flex flex-col">
          <TableContainer
            id={`${columnID}-table-container`}
            className="flex-1 overflow-auto"
            style={{ maxHeight: '500px' }}
            data-cy={`${columnID}-continuous-table`}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow className="bg-blue-50">
                  <TableCell
                    align="left"
                    sx={{
                      fontWeight: 'bold',
                      color: 'primary.main',
                      width: standardizedVariable ? '70%' : '',
                    }}
                  >
                    Value
                  </TableCell>
                  {standardizedVariable && (
                    <TableCell
                      align="left"
                      sx={{ fontWeight: 'bold', color: 'primary.main', width: '30%' }}
                    >
                      Status
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {uniqueValues.map((value, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <TableRow key={`${columnID}-${value}-${index}`}>
                    <TableCell align="left" data-cy={`${columnID}-${value}-${index}-value`}>
                      {value}
                    </TableCell>
                    {standardizedVariable && (
                      <TableCell align="left">
                        <MissingValueButton
                          // eslint-disable-next-line react/no-array-index-key
                          key={`${columnID}-${value}-${index}-missingbutton`}
                          value={value}
                          columnId={columnID}
                          missingValues={missingValues}
                          onToggleMissingValue={onToggleMissingValue}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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

          {standardizedVariable && (
            <Autocomplete
              data-cy={`${columnID}-format-dropdown`}
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
                // eslint-disable-next-line react/jsx-props-no-spreading
                <TextField {...params} label="Format" variant="outlined" fullWidth />
              )}
            />
          )}
        </div>
      </div>
    </Paper>
  );
}

Continuous.defaultProps = defaultProps;

export default Continuous;
