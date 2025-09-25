import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Autocomplete,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useSortedFilteredValues } from '~/hooks';
import useDataStore from '~/stores/data';
import { StandardizedVariable } from '~/utils/internal_types';
import DescriptionEditor from './DescriptionEditor';
import MissingValueButton from './MissingValueButton';
import StatusFilterCell from './StatusFilterCell';
import ValueSortCell from './ValueSortCell';
import VirtualListbox from './VirtualListBox';

interface CategoricalProps {
  columnID: string;
  uniqueValues: string[];
  levels: { [key: string]: { description: string; label?: string; termURL?: string } };
  missingValues: string[];
  standardizedVariable?: StandardizedVariable | null;
  onUpdateDescription: (columnId: string, value: string, description: string) => void;
  onToggleMissingValue: (columnId: string, value: string, isMissing: boolean) => void;
  onUpdateLevelTerm: (
    columnId: string,
    value: string,
    term: { identifier: string; label: string } | null
  ) => void;
}

const defaultProps = {
  standardizedVariable: null,
};

function Categorical({
  columnID,
  uniqueValues,
  levels,
  missingValues,
  standardizedVariable,
  onUpdateDescription,
  onToggleMissingValue,
  onUpdateLevelTerm,
}: CategoricalProps) {
  const isMultiColumnMeasureStandardizedVariable = useDataStore((state) =>
    state.isMultiColumnMeasureStandardizedVariable(standardizedVariable)
  );
  const showStandardizedTerm = standardizedVariable && !isMultiColumnMeasureStandardizedVariable;

  const termOptions = useDataStore((state) => state.termOptions);
  const options = standardizedVariable ? termOptions[standardizedVariable.identifier] || [] : [];

  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [filterMissing, setFilterMissing] = useState(false);

  const { visibleValues } = useSortedFilteredValues(
    uniqueValues,
    missingValues,
    sortDir,
    filterMissing
  );

  return (
    <TableContainer
      id={`${columnID}-table-container`}
      component={Paper}
      elevation={3}
      className="h-full shadow-lg overflow-auto"
      style={{ maxHeight: '500px' }}
      data-cy={`${columnID}-categorical`}
    >
      <Table stickyHeader className="min-w-[768px]" data-cy={`${columnID}-categorical-table`}>
        <TableHead data-cy={`${columnID}-categorical-table-head`}>
          <TableRow className="bg-blue-50">
            <ValueSortCell
              sortDir={sortDir}
              onToggle={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
              dataCy={`${columnID}-sort-values-button`}
            />
            <TableCell align="left" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Description
            </TableCell>
            {showStandardizedTerm && (
              <TableCell align="left" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Standardized Term
              </TableCell>
            )}
            {standardizedVariable && (
              <StatusFilterCell
                filterMissing={filterMissing}
                onToggle={() => setFilterMissing((f) => !f)}
                dataCy={`${columnID}-filter-status-button`}
              />
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleValues.map((value) => (
            <TableRow key={`${columnID}-${value}`} data-cy={`${columnID}-${value}`}>
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
              {showStandardizedTerm && (
                <TableCell align="left">
                  <Autocomplete
                    data-cy={`${columnID}-${value}-term-dropdown`}
                    options={options}
                    getOptionLabel={(option) => option.label}
                    value={options.find((opt) => opt.identifier === levels[value]?.termURL) || null}
                    onChange={(_, newValue) => {
                      onUpdateLevelTerm(columnID, value, newValue);
                    }}
                    renderInput={(params) => (
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      <TextField {...params} variant="standard" size="small" fullWidth />
                    )}
                    renderOption={(props, option) => (
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      <li {...props} data-cy={`${columnID}-${value}-term-dropdown-option`}>
                        <Tooltip
                          data-cy={`${columnID}-${value}-term-tooltip`}
                          title={option.label}
                          placement="right"
                          enterDelay={400}
                          arrow
                          slotProps={{
                            tooltip: {
                              sx: {
                                fontSize: '16px',
                              },
                            },
                          }}
                        >
                          <div className="w-full truncate">{option.label}</div>
                        </Tooltip>
                      </li>
                    )}
                    slotProps={{
                      listbox: {
                        component: VirtualListbox,
                      },
                      paper: {
                        sx: {
                          width: 'max-content',
                          minWidth: '500px',
                        },
                      },
                    }}
                  />
                </TableCell>
              )}
              {standardizedVariable && (
                <TableCell align="left">
                  <MissingValueButton
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
  );
}

Categorical.defaultProps = defaultProps;

export default Categorical;
