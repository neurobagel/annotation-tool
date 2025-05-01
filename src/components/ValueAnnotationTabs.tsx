import { Paper, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { Columns } from '../utils/types';
import Categorical from './Categorical';
import Continuous from './Continuous';

interface ValueAnnotationTabsProps {
  columns: Columns;
  dataTable: Record<string, string[]>;
  onUpdateDescription: (columnID: string, value: string, description: string) => void;
  onUpdateUnits: (columnID: string, units: string) => void;
  onToggleMissingValue: (columnID: string, value: string, isMissing: boolean) => void;
  onUpdateFormat: (columnID: string, format: { termURL: string; label: string } | null) => void;
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
  const [activeTab, setActiveTab] = useState(0);
  const columnEntries = Object.entries(columns);
  const columnIds = Object.keys(columns);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (columnIds.length === 0) {
    return <Paper elevation={3}>No columns to display</Paper>;
  }

  return (
    <Paper elevation={3} className="h-full flex flex-col">
      <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
        {columnIds.map((columnId) => (
          <Tab
            key={columnId}
            label={columns[columnId].header || columnId}
            data-cy={`${columnId}-tab`}
          />
        ))}
      </Tabs>
      <div className="flex-1 overflow-auto p-2">
        {columnEntries.map(([columnId, column], index) => {
          const uniqueValues = dataTable[columnId] ? Array.from(new Set(dataTable[columnId])) : [];

          return (
            <div
              key={columnId}
              role="tabpanel"
              hidden={activeTab !== index}
              id={`tabpanel-${columnId}`}
              aria-labelledby={`tab-${columnId}`}
            >
              {activeTab === index && (
                <div className="h-full">
                  {column.dataType === 'Categorical' ? (
                    <Categorical
                      columnID={columnId}
                      uniqueValues={uniqueValues}
                      levels={column.levels || {}}
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
                      columnValues={dataTable[columnId] || []}
                      format={column.format}
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
