import { ArrowUpward, ArrowDownward, FilterList } from '@mui/icons-material';
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
  IconButton,
  Tooltip,
} from '@mui/material';
import { useState, useMemo } from 'react';
import useDataStore from '~/stores/data';
import { StandardizedVariable } from '../utils/internal_types';
import DescriptionEditor from './DescriptionEditor';
import MissingValueButton from './MissingValueButton';

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

  const sortedValues = useMemo(
    () =>
      [...uniqueValues].sort((a, b) =>
        sortDir === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
      ),
    [uniqueValues, sortDir]
  );

  const visibleValues = useMemo(
    () => (filterMissing ? sortedValues.filter((v) => missingValues.includes(v)) : sortedValues),
    [sortedValues, filterMissing, missingValues]
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
            <TableCell
              data-cy={`${columnID}-sort-values-button`}
              align="left"
              sx={{ fontWeight: 'bold', color: 'primary.main', cursor: 'pointer' }}
              onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
            >
              Value
              {sortDir === 'asc' ? (
                <ArrowUpward fontSize="inherit" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
              ) : (
                <ArrowDownward fontSize="inherit" sx={{ ml: 0.5, verticalAlign: 'middle' }} />
              )}
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Description
            </TableCell>
            {showStandardizedTerm && (
              <TableCell align="left" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Standardized Term
              </TableCell>
            )}
            {standardizedVariable && (
              <TableCell align="left" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Status
                <Tooltip title={filterMissing ? 'Show all values' : 'Show only missing'}>
                  <IconButton
                    data-cy={`${columnID}-filter-status-button`}
                    size="small"
                    color={filterMissing ? 'primary' : 'default'}
                    onClick={() => setFilterMissing((f) => !f)}
                  >
                    <FilterList fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </TableCell>
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
