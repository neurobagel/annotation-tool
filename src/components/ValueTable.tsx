import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react';
import { useSortedValues } from '../hooks/useSortedValues';
import MissingValueGroupButton from './MissingValueGroupButton';
import SortCell from './SortCell';

interface ValueTableProps {
  columnID: string;
  uniqueValues: string[];
  missingValues: string[];
  showMissingToggle?: boolean;
  onToggleMissingValue?: (columnId: string, value: string, isMissing: boolean) => void;
  extraTableHeadCells?: React.ReactNode;
  renderExtraTableCells?: (value: string, index: number) => React.ReactNode;
  rightSidebarContent?: React.ReactNode;
  dataCy?: string;
  tableClassName?: string;
}

export default function ValueTable({
  columnID,
  uniqueValues,
  missingValues,
  showMissingToggle = false,
  onToggleMissingValue,
  extraTableHeadCells,
  renderExtraTableCells,
  rightSidebarContent,
  dataCy,
  tableClassName = 'min-w-[768px]',
}: ValueTableProps) {
  const [sortBy, setSortBy] = useState<'value' | 'missing'>('value');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const { visibleValues } = useSortedValues(uniqueValues, missingValues, sortBy, sortDir);

  const tableContent = (
    <TableContainer
      id={`${columnID}-table-container`}
      className="flex-1 overflow-auto"
      style={{ maxHeight: '500px' }}
      data-cy={`${columnID}-table-container`}
    >
      <Table
        stickyHeader
        className={tableClassName}
        sx={{ tableLayout: 'fixed' }}
        data-cy={`${columnID}-value-table-element`}
      >
        <TableHead data-cy={`${columnID}-value-table-head`}>
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
              width="20%"
            />
            {extraTableHeadCells}
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
                align="center"
                width="20%"
              />
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleValues.map((value, index) => (
            <TableRow key={`${columnID}-${value}`} data-cy={`${columnID}-${value}`}>
              <TableCell align="left" data-cy={`${columnID}-${value}-value`}>
                {value}
              </TableCell>
              {renderExtraTableCells && renderExtraTableCells(value, index)}
              {showMissingToggle && onToggleMissingValue && (
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

  return (
    <div className="h-full flex flex-col" data-cy={dataCy || `${columnID}-value-table-container`}>
      <div className="flex flex-1 h-full overflow-hidden">
        <div className={rightSidebarContent ? 'w-3/5 flex flex-col' : 'w-full flex flex-col'}>
          {tableContent}
        </div>
        {rightSidebarContent && (
          <div className="w-2/5 p-4 space-y-4 overflow-y-auto">{rightSidebarContent}</div>
        )}
      </div>
    </div>
  );
}
