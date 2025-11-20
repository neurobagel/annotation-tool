import { Paper, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { DataType } from '../../datamodel';
import type { FormatOption } from '../hooks/useFormatOptions';
import type { TermOption } from '../hooks/useTermOptions';
import Categorical from './Categorical';
import Continuous from './Continuous';

export interface ValueAnnotationTabColumn {
  id: string;
  name: string;
  dataType: DataType | null;
  uniqueValues: string[];
  levels: { [key: string]: { description: string; standardizedTerm?: string } };
  missingValues: string[];
  units: string;
  formatId: string | null;
  termOptions: TermOption[];
  formatOptions: FormatOption[];
  showStandardizedTerm: boolean;
  showMissingToggle: boolean;
  showFormat: boolean;
  showUnits: boolean;
}

interface ValueAnnotationTabsProps {
  columns: Record<string, ValueAnnotationTabColumn>;
  columnOrder: string[];
  onUpdateDescription: (columnID: string, value: string, description: string) => void;
  onUpdateUnits: (columnID: string, units: string) => void;
  onToggleMissingValue: (columnID: string, value: string, isMissing: boolean) => void;
  onUpdateFormat: (columnID: string, formatId: string | null) => void;
  onUpdateLevelTerm: (columnID: string, value: string, termId: string | null) => void;
}

function ValueAnnotationTabs({
  columns,
  columnOrder,
  onUpdateDescription,
  onUpdateUnits,
  onToggleMissingValue,
  onUpdateFormat,
  onUpdateLevelTerm,
}: ValueAnnotationTabsProps) {
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  useEffect(() => {
    if (columnOrder.length > 0 && (!selectedColumnId || !columnOrder.includes(selectedColumnId))) {
      setSelectedColumnId(columnOrder[0]);
    }
  }, [columnOrder, selectedColumnId]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedColumnId(newValue);
  };

  if (columnOrder.length === 0) {
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
        {columnOrder.map((columnId) => {
          const column = columns[columnId];
          if (!column) {
            return null;
          }

          return (
            <Tab
              key={columnId}
              value={columnId}
              label={column.name || columnId}
              data-cy={`${columnId}-tab`}
            />
          );
        })}
      </Tabs>
      <div className="flex-1 overflow-auto p-2">
        {columnOrder.map((columnId) => {
          const column = columns[columnId];
          if (!column) {
            return null;
          }

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
                  {column.dataType === DataType.categorical ? (
                    <Categorical
                      columnID={columnId}
                      uniqueValues={column.uniqueValues}
                      levels={column.levels}
                      missingValues={column.missingValues}
                      termOptions={column.termOptions}
                      showStandardizedTerm={column.showStandardizedTerm}
                      showMissingToggle={column.showMissingToggle}
                      onUpdateDescription={onUpdateDescription}
                      onToggleMissingValue={onToggleMissingValue}
                      onUpdateLevelTerm={onUpdateLevelTerm}
                    />
                  ) : (
                    <Continuous
                      columnID={columnId}
                      units={column.units}
                      missingValues={column.missingValues}
                      uniqueValues={column.uniqueValues}
                      formatId={column.formatId}
                      formatOptions={column.formatOptions}
                      showFormat={column.showFormat}
                      showUnits={column.showUnits}
                      showMissingToggle={column.showMissingToggle}
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
