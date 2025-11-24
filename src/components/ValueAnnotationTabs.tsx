import { Paper, Tab, Tabs } from '@mui/material';
import type { SyntheticEvent } from 'react';
import { DataType } from '../../internal_types';
import type { ColumnMetadataSummary } from '../hooks/useColumnsMetadata';
import type { ActiveValueAnnotationColumn } from '../hooks/useValueAnnotationColumn';
import Categorical from './Categorical';
import Continuous from './Continuous';

export type ValueAnnotationTabMetadata = ColumnMetadataSummary;

interface ValueAnnotationTabsProps {
  columnOrder: string[];
  columnsMeta: Record<string, ValueAnnotationTabMetadata>;
  activeColumnId: string | null;
  activeColumn: ActiveValueAnnotationColumn | null;
  onChangeActiveColumn: (columnId: string) => void;
  onUpdateDescription: (columnID: string, value: string, description: string) => void;
  onUpdateUnits: (columnID: string, units: string) => void;
  onToggleMissingValue: (columnID: string, value: string, isMissing: boolean) => void;
  onUpdateFormat: (columnID: string, formatId: string | null) => void;
  onUpdateLevelTerm: (columnID: string, value: string, termId: string | null) => void;
}

function ValueAnnotationTabs({
  columnOrder,
  columnsMeta,
  activeColumnId,
  activeColumn,
  onChangeActiveColumn,
  onUpdateDescription,
  onUpdateUnits,
  onToggleMissingValue,
  onUpdateFormat,
  onUpdateLevelTerm,
}: ValueAnnotationTabsProps) {
  const handleTabChange = (_: SyntheticEvent, newValue: string) => {
    onChangeActiveColumn(newValue);
  };

  if (columnOrder.length === 0) {
    return <Paper elevation={3}>No columns to display</Paper>;
  }

  if (!activeColumnId || !activeColumn) {
    return (
      <Paper elevation={3} className="h-full flex flex-col">
        <Tabs
          data-cy="value-annotation-tabs"
          value={false}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {columnOrder.map((columnId) => {
            const column = columnsMeta[columnId];
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
        <div className="flex-1 items-center justify-center flex p-2">
          <Paper elevation={0} className="p-6 text-center">
            <p>No column selected.</p>
          </Paper>
        </div>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} className="h-full flex flex-col">
      <Tabs
        data-cy="value-annotation-tabs"
        value={activeColumnId}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {columnOrder.map((columnId) => {
          const column = columnsMeta[columnId];
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
        {activeColumn.dataType === DataType.categorical ? (
          <Categorical
            columnID={activeColumn.id}
            uniqueValues={activeColumn.uniqueValues}
            levels={activeColumn.levels}
            missingValues={activeColumn.missingValues}
            termOptions={activeColumn.termOptions}
            showStandardizedTerm={activeColumn.showStandardizedTerm}
            showMissingToggle={activeColumn.showMissingToggle}
            onUpdateDescription={onUpdateDescription}
            onToggleMissingValue={onToggleMissingValue}
            onUpdateLevelTerm={onUpdateLevelTerm}
          />
        ) : (
          <Continuous
            columnID={activeColumn.id}
            units={activeColumn.units}
            missingValues={activeColumn.missingValues}
            uniqueValues={activeColumn.uniqueValues}
            formatId={activeColumn.formatId}
            formatOptions={activeColumn.formatOptions}
            showFormat={activeColumn.showFormat}
            showUnits={activeColumn.showUnits}
            showMissingToggle={activeColumn.showMissingToggle}
            onUpdateUnits={onUpdateUnits}
            onToggleMissingValue={onToggleMissingValue}
            onUpdateFormat={onUpdateFormat}
          />
        )}
      </div>
    </Paper>
  );
}

export default ValueAnnotationTabs;
