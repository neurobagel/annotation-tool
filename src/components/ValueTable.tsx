import { Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react';
import { List, useDynamicRowHeight } from 'react-window';
import { useSortedValues } from '../hooks/useSortedValues';
import SortCell from './SortCell';
import ValueTableRow from './ValueTableRow';

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

  const dynamicRowHeight = useDynamicRowHeight({ defaultRowHeight: 73 });

  let valueWidth: string | undefined;
  if (extraTableHeadCells) {
    valueWidth = showMissingToggle ? '15%' : '20%';
  }

  const tableContent = (
    <TableContainer
      id={`${columnID}-table-container`}
      className="flex-1 overflow-x-auto overflow-y-hidden"
      data-cy={`${columnID}-table-container`}
      component="div"
    >
      <Table
        stickyHeader
        className={`${tableClassName} h-full flex flex-col`}
        sx={{ tableLayout: 'fixed' }}
        data-cy={`${columnID}-value-table-element`}
        component="div"
      >
        <TableHead data-cy={`${columnID}-value-table-head`} component="div">
          <TableRow className="bg-blue-50" component="div" sx={{ display: 'flex', width: '100%' }}>
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
              component="div"
              width={valueWidth}
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
                width={extraTableHeadCells ? '25%' : '35%'}
                component="div"
              />
            )}
          </TableRow>
        </TableHead>
        <TableBody component="div" className="flex-1 w-full relative overflow-hidden">
          <List
            rowCount={visibleValues.length}
            rowHeight={dynamicRowHeight}
            rowComponent={ValueTableRow}
            rowProps={{
              items: {
                visibleValues,
                columnID,
                missingValues,
                showMissingToggle,
                onToggleMissingValue,
                renderExtraTableCells,
              },
            }}
          />
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
