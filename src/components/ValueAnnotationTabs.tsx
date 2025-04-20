import { Paper, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { Columns } from '../utils/types';
import Categorical from './Categorical';
import Continuous from './Continuous';

interface ValueAnnotationTabsProps {
  columns: Columns;
  dataTable: Record<string, string[]>;
  onUpdateDescription: (columnId: string, value: string, description: string) => void;
  onUpdateUnits: (columnId: string, units: string) => void;
}

function ValueAnnotationTabs({
  columns,
  dataTable,
  onUpdateDescription,
  onUpdateUnits,
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

  if (columnIds.length === 1) {
    const [columnId, column] = columnEntries[0];
    const uniqueValues = dataTable[columnId] ? Array.from(new Set(dataTable[columnId])) : [];

    return (
      <div className="h-full">
        {column.dataType === 'Categorical' ? (
          <Categorical
            columnID={columnId}
            uniqueValues={uniqueValues}
            levels={column.levels || {}}
            onUpdateDescription={onUpdateDescription}
          />
        ) : (
          <Continuous
            columnID={columnId}
            units={column.units || ''}
            onUpdateUnits={onUpdateUnits}
          />
        )}
      </div>
    );
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
                      onUpdateDescription={onUpdateDescription}
                    />
                  ) : (
                    <Continuous
                      columnID={columnId}
                      units={column.units || ''}
                      onUpdateUnits={onUpdateUnits}
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
