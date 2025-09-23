import {
  List,
  ListItem,
  ListItemText,
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
import { useState } from 'react';
import { useSortedFilteredValues } from '~/hooks';
import useDataStore from '~/stores/data';
import { StandardizedVariable } from '~/utils/internal_types';
import DescriptionEditor from './DescriptionEditor';
import Instruction from './Instruction';
import MissingValueButton from './MissingValueButton';
import StatusFilterCell from './StatusFilterCell';
import ValueSortCell from './ValueSortCell';

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
    <>
    <Instruction className="mb-2">
        <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item' }}>
            <ListItemText primary="Enter a description for each observed value." />
          </ListItem>
          {showStandardizedTerm ? (
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="Map values to standardized terms to enable harmonized queries." />
            </ListItem>
          ) : (
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="Standardized term mapping is unavailable for this column." />
            </ListItem>
          )}
          {standardizedVariable ? (
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="Mark which values represent missing data." />
            </ListItem>
          ) : (
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText primary="Missing value tagging becomes available once a standardized variable is selected." />
            </ListItem>
          )}
        </List>
      </Instruction>
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
    </>
  );
}

Categorical.defaultProps = defaultProps;

export default Categorical;
