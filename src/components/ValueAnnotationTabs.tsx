import { Paper, Tab, Tabs } from '@mui/material';
import { useState, useEffect } from 'react';
import { Columns, TermFormat } from '../utils/types';
import Categorical from './Categorical';
import Continuous from './Continuous';

interface ValueAnnotationTabsProps {
  columns: Columns;
  dataTable: Record<string, string[]>;
  onUpdateDescription: (columnID: string, value: string, description: string) => void;
  onUpdateUnits: (columnID: string, units: string) => void;
  onToggleMissingValue: (columnID: string, value: string, isMissing: boolean) => void;
  onUpdateFormat: (columnID: string, format: TermFormat | null) => void;
  onUpdateLevelTerm: (
    columnID: string,
    value: string,
    term: { identifier: string; label: string } | null
  ) => void;
}

function ValueAnnotationTabs({
  columns,
  dataTable,
  onUpdateDescription,
  onUpdateUnits,
  onToggleMissingValue,
  onUpdateFormat,
  onUpdateLevelTerm,
}: ValueAnnotationTabsProps) {
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const columnEntries = Object.entries(columns);
  const columnIds = Object.keys(columns);
  useEffect(() => {
    if (columnIds.length > 0 && (!selectedColumnId || !columnIds.includes(selectedColumnId))) {
      setSelectedColumnId(columnIds[0]);
    }
  }, [columnIds, selectedColumnId]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedColumnId(newValue);
  };

  if (columnIds.length === 0) {
    return <Paper elevation={3}>No columns to display</Paper>;
  }

  return (
    <Paper elevation={3} className="h-full flex flex-col">
      <Tabs
        data-cy="value-annotation-tabs"
        value={selectedColumnId || false}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {columnIds.map((columnId) => (
          <Tab
            key={columnId}
            value={columnId}
            label={columns[columnId].header || columnId}
            data-cy={`${columnId}-tab`}
          />
        ))}
      </Tabs>
      <div className="flex-1 overflow-auto p-2">
        {columnEntries.map(([columnId, column]) => {
          const uniqueValues = dataTable[columnId] ? Array.from(new Set(dataTable[columnId])) : [];

          return (
            <div
              key={columnId}
              role="tabpanel"
              hidden={selectedColumnId !== columnId}
              id={`tabpanel-${columnId}`}
              aria-labelledby={`tab-${columnId}`}
            >
              {selectedColumnId === columnId && (
                <div className="h-full">
                  {column.dataType === 'Categorical' ? (
                    <Categorical
                      columnID={columnId}
                      uniqueValues={uniqueValues}
                      levels={column.levels || {}}
                      standardizedVariable={column.standardizedVariable}
                      missingValues={column.missingValues || []}
                      onUpdateDescription={onUpdateDescription}
                      onToggleMissingValue={onToggleMissingValue}
                      onUpdateLevelTerm={onUpdateLevelTerm}
                    />
                  ) : (
                    <Continuous
                      columnID={columnId}
                      units={column.units || ''}
                      missingValues={column.missingValues || []}
                      uniqueValues={uniqueValues}
                      format={column.format}
                      standardizedVariable={column.standardizedVariable}
                      onUpdateUnits={onUpdateUnits}
                      onToggleMissingValue={onToggleMissingValue}
                      onUpdateFormat={onUpdateFormat}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Paper>
  );
}

export default ValueAnnotationTabs;
