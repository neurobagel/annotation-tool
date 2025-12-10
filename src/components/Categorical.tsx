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
  Tooltip,
} from '@mui/material';
import { matchSorter } from 'match-sorter';
import { useState } from 'react';
import type { TermOption } from '~/hooks/useTermOptions';
import { useSortedValues } from '../hooks/useSortedValues';
import DescriptionEditor from './DescriptionEditor';
import MissingValueGroupButton from './MissingValueGroupButton';
import SortCell from './SortCell';
import VirtualListbox from './VirtualListBox';

interface CategoricalProps {
  columnID: string;
  uniqueValues: string[];
  levels: { [key: string]: { description: string; standardizedTerm?: string } };
  missingValues: string[];
  termOptions: TermOption[];
  showStandardizedTerm?: boolean;
  showMissingToggle?: boolean;
  onUpdateDescription: (columnId: string, value: string, description: string) => void;
  onToggleMissingValue: (columnId: string, value: string, isMissing: boolean) => void;
  onUpdateLevelTerm: (columnId: string, value: string, termId: string | null) => void;
}

const defaultProps = {
  showStandardizedTerm: false,
  showMissingToggle: false,
};

function Categorical({
  columnID,
  uniqueValues,
  levels,
  missingValues,
  termOptions,
  showStandardizedTerm = false,
  showMissingToggle = false,
  onUpdateDescription,
  onToggleMissingValue,
  onUpdateLevelTerm,
}: CategoricalProps) {
  const [sortBy, setSortBy] = useState<'value' | 'missing'>('value');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const { visibleValues } = useSortedValues(uniqueValues, missingValues, sortBy, sortDir);

  const filterOptions = (items: TermOption[], { inputValue }: { inputValue: string }) =>
    matchSorter(items, inputValue, {
      keys: [
        (option) =>
          option.abbreviation ? `${option.abbreviation} - ${option.label}` : option.label,
      ],
      baseSort: (a, b) => a.index - b.index,
    });

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
              isActive={sortBy === 'value'}
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
                isActive={sortBy === 'missing'}
                dataCy={`${columnID}-sort-status-button`}
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
                    disabled={missingValues.includes(value)}
                    data-cy={`${columnID}-${value}-term-dropdown`}
                    options={termOptions}
                    getOptionLabel={(option: TermOption) =>
                      option.abbreviation
                        ? `${option.abbreviation} - ${option.label}`
                        : option.label
                    }
                    value={
                      termOptions.find((opt) => opt.id === levels[value]?.standardizedTerm) || null
                    }
                    onChange={(_, newValue) => {
                      onUpdateLevelTerm(columnID, value, newValue?.id ?? null);
                    }}
                    filterOptions={filterOptions}
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
              {showMissingToggle && (
                <TableCell align="center">
                  <MissingValueGroupButton
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
