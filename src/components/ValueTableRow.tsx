import { TableCell, TableRow } from '@mui/material';
import React from 'react';
import type { RowComponentProps } from 'react-window';
import MissingValueGroupButton from './MissingValueGroupButton';

export interface ValueTableRowData {
  visibleValues: string[];
  columnID: string;
  missingValues: string[];
  showMissingToggle: boolean;
  onToggleMissingValue?: (columnId: string, value: string, isMissing: boolean) => void;
  renderExtraTableCells?: (value: string, index: number) => React.ReactNode;
}

export default function ValueTableRow({
  index,
  items,
  style,
}: RowComponentProps<{ items: ValueTableRowData }>) {
  const {
    visibleValues,
    columnID,
    missingValues,
    showMissingToggle,
    onToggleMissingValue,
    renderExtraTableCells,
  } = items;
  const value = visibleValues[index];

  let valueWidth: string | undefined;
  if (renderExtraTableCells) {
    valueWidth = showMissingToggle ? '15%' : '20%';
  }

  return (
    <TableRow
      component="div"
      key={`${columnID}-${value}`}
      data-cy={`${columnID}-${value}`}
      style={style}
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider',
        '& .MuiTableCell-root': {
          borderBottom: 'none',
        },
      }}
    >
      <TableCell
        component="div"
        align="left"
        data-cy={`${columnID}-${value}-value`}
        sx={{
          flex: renderExtraTableCells ? 'none' : 1,
          width: valueWidth,
          flexShrink: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </TableCell>
      {renderExtraTableCells && renderExtraTableCells(value, index)}
      {showMissingToggle && onToggleMissingValue && (
        <TableCell
          component="div"
          align="center"
          sx={{
            width: renderExtraTableCells ? '25%' : '35%',
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <MissingValueGroupButton
            value={value}
            columnId={columnID}
            missingValues={missingValues}
            onToggleMissingValue={onToggleMissingValue}
          />
        </TableCell>
      )}
    </TableRow>
  );
}
