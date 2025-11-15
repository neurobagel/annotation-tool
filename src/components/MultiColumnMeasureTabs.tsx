import { Tabs, Tab } from '@mui/material';
import { SyntheticEvent } from 'react';
import { StandardizedVariable } from '../../datamodel';

interface MultiColumnMeasureTabsProps {
  variables: StandardizedVariable[];
  value: number;
  onChange: (event: SyntheticEvent, newValue: number) => void;
}

function MultiColumnMeasureTabs({ variables, value, onChange }: MultiColumnMeasureTabsProps) {
  return (
    <Tabs
      value={value}
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
