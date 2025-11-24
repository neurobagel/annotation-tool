import { Tabs, Tab } from '@mui/material';
import { SyntheticEvent } from 'react';
import { StandardizedVariable } from '../../internal_types';

interface MultiColumnMeasureTabsProps {
  variables: StandardizedVariable[];
  selectedTabIndex: number;
  onChange: (event: SyntheticEvent, newValue: number) => void;
}

function MultiColumnMeasureTabs({
  variables,
  selectedTabIndex,
  onChange,
}: MultiColumnMeasureTabsProps) {
  return (
    <Tabs
      value={selectedTabIndex}
      onChange={onChange}
      aria-label="Multi-column measures tabs"
      data-cy="multi-column-measures-tabs"
    >
      {variables.map((variable, index) => (
        <Tab
          data-cy={`multi-column-measures-tab-${variable.name}`}
          key={variable.id}
          label={variable.name}
          id={`tab-${index}`}
        />
      ))}
    </Tabs>
  );
}

export default MultiColumnMeasureTabs;
