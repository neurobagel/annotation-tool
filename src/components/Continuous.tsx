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
import useDataStore from '~/stores/data';
import { StandardizedVariable, TermFormat } from '~/utils/internal_types';
import DescriptionEditor from './DescriptionEditor';
import MissingValueButton from './MissingValueButton';

interface ContinuousProps {
  columnID: string;
  units: string;
  uniqueValues: string[];
  missingValues: string[];
  format?: TermFormat;
  standardizedVariable?: StandardizedVariable | null;
  onUpdateUnits: (columnID: string, units: string) => void;
  onToggleMissingValue: (columnID: string, value: string, isMissing: boolean) => void;
  onUpdateFormat: (columnID: string, format: { termURL: string; label: string } | null) => void;
}

const defaultProps = {
  standardizedVariable: null,
  format: null,
};

function Continuous({
  columnID,
  units,
  uniqueValues,
  missingValues,
  format,
  standardizedVariable,
  onUpdateUnits,
  onToggleMissingValue,
  onUpdateFormat,
}: ContinuousProps) {
  const {
    columns,
    getFormatOptions,
    isMultiColumnMeasureStandardizedVariable: isMultiMeasureColumnStandardizedVariable,
  } = useDataStore();

  const showFormat =
    standardizedVariable && !isMultiMeasureColumnStandardizedVariable(standardizedVariable);
  // Don't show units when the variable is a multi column measure and its data type is null
  const showUnits = !(
    isMultiMeasureColumnStandardizedVariable(standardizedVariable) &&
    columns[columnID].dataType === null
  );

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
          {showUnits && (
            <DescriptionEditor
              key={`${columnID}-units`}
              label="Units"
              columnID={columnID}
              description={units}
              onDescriptionChange={(id, newUnits) => {
                onUpdateUnits(id, newUnits || '');
              }}
            />
          )}

          {showFormat && (
            <Autocomplete
              data-cy={`${columnID}-format-dropdown`}
              options={getFormatOptions(standardizedVariable)}
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <li {...props}>
                  <div>
                    <div>{option.label}</div>
                    {option.examples && (
                      <div className="text-xs text-gray-500">
                        Examples: {option.examples.join(', ')}
                      </div>
                    )}
                  </div>
                </li>
              )}
              value={
                getFormatOptions(standardizedVariable).find(
                  (opt) => opt.termURL === format?.termURL
                ) || null
              }
              onChange={(_, newValue) => {
                onUpdateFormat(
                  columnID,
                  newValue
                    ? {
                        termURL: newValue.termURL,
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
