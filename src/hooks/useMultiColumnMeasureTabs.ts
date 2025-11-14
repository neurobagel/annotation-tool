import { useEffect, useState } from 'react';
import { StandardizedVariable } from '../../datamodel';
import { useMultiColumnMeasureVariables } from './useMultiColumnMeasureVariables';

export interface ActiveMultiColumnVariable {
  variables: StandardizedVariable[];
  activeVariable?: StandardizedVariable;
  activeTab: number;
  setActiveTab: (index: number) => void;
}

/**
 * Manages the active tab state for the Multi-Column Measure view.
 * It listens to the derived list of multi-column variables, resets the tab index
 * whenever the list shrinks (to avoid pointing to a non-existent tab), and exposes
 * the currently selected variable alongside a setter for the tab.
 */
export function useMultiColumnMeasureTabs(): ActiveMultiColumnVariable {
  const variables = useMultiColumnMeasureVariables();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const nextTab = variables.length === 0 ? 0 : Math.min(activeTab, variables.length - 1);
    if (activeTab !== nextTab) {
      setActiveTab(nextTab);
    }
  }, [activeTab, variables.length]);

  const activeVariable = variables[Math.min(activeTab, variables.length - 1)] ?? variables[0];

  return {
    variables,
    activeVariable,
    activeTab: Math.min(activeTab, variables.length === 0 ? 0 : variables.length - 1),
    setActiveTab,
  };
}
