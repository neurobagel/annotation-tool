import {
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useSortedValues } from '~/hooks';
import { FormatOption } from '~/hooks/useFormatOptions';
import DescriptionEditor from './DescriptionEditor';
import MissingValueGroupButton from './MissingValueGroupButton';
import SortCell from './SortCell';

interface ContinuousProps {
  columnID: string;
  units: string;
  uniqueValues: string[];
  missingValues: string[];
  formatId?: string | null;
  formatOptions: FormatOption[];
  showUnits?: boolean;
  showFormat?: boolean;
  showMissingToggle?: boolean;
  onUpdateUnits: (columnID: string, units: string) => void;
  onToggleMissingValue: (columnID: string, value: string, isMissing: boolean) => void;
  onUpdateFormat: (columnID: string, formatId: string | null) => void;
}

const defaultProps = {
  formatId: null,
  showUnits: true,
  showFormat: true,
  showMissingToggle: false,
};

function Continuous({
  columnID,
  units,
  uniqueValues,
  missingValues,
  formatId = null,
  formatOptions,
  showUnits = true,
  showFormat = true,
  showMissingToggle = false,
  onUpdateUnits,
  onToggleMissingValue,
  onUpdateFormat,
}: ContinuousProps) {
  const [sortBy, setSortBy] = useState<'value' | 'missing'>('value');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const { visibleValues } = useSortedValues(uniqueValues, missingValues, sortBy, sortDir);

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
                  <SortCell
                    label="Value"
                    sortDir={sortDir}
                    onToggle={() => {
                      if (sortBy === 'value') {
                        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                      } else {
                        setSortBy('value');
                        setSortDir('asc');
                      }
                    }}
                    width={showMissingToggle ? '60%' : undefined}
                    isActive={sortBy === 'value'}
                    dataCy={`${columnID}-sort-values-button`}
                  />
                  {showMissingToggle && (
                    <SortCell
                      label="Treat as missing value"
                      sortDir={sortDir}
                      onToggle={() => {
                        if (sortBy === 'missing') {
                          setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                        } else {
                          setSortBy('missing');
                          setSortDir('asc');
                        }
                      }}
                      width="40%"
                      isActive={sortBy === 'missing'}
                      dataCy={`${columnID}-sort-status-button`}
                    />
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleValues.map((value, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <TableRow key={`${columnID}-${value}-${index}`}>
                    <TableCell align="left" data-cy={`${columnID}-${value}-${index}-value`}>
                      {value}
                    </TableCell>
                    {showMissingToggle && (
                      <TableCell align="center">
                        <MissingValueGroupButton
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
              options={formatOptions}
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
              value={formatOptions.find((opt) => opt.id === formatId) || null}
              onChange={(_, newValue) => {
                onUpdateFormat(columnID, newValue?.id ?? null);
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
