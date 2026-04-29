import { useState, useMemo } from 'react';
import { useColumns, useDataActions } from '../stores/data';
import { GlobalMissingValue } from '../utils/internal_types';

export const COMMON_MISSING_VALUES = ['N/A', 'NA', 'NaN', 'null', '-999', 'Unknown', 'Missing', ''];

export function useGlobalMissingStatus() {
  const [missingValues, setMissingValues] = useState<GlobalMissingValue[]>([]);
  const columns = useColumns();
  const { userAppliesGlobalMissingStatus, userRemovesGlobalMissingStatus } = useDataActions();

  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const allUniqueValues = useMemo(() => {
    const unique = new Set<string>();
    Object.values(columns).forEach((column) => {
      column.allValues.forEach((val) => unique.add(val));
    });
    return unique;
  }, [columns]);

  // Compute suggestions based on what's present in the uploaded data
  const availableSuggestions = useMemo(() => {
    const commonLower = COMMON_MISSING_VALUES.map((v) => v.toLowerCase());
    return Array.from(allUniqueValues)
      .filter((uniqueVal) => commonLower.includes(uniqueVal.trim().toLowerCase()))
      .filter((sv) => !missingValues.some((mv) => mv.value === sv));
  }, [allUniqueValues, missingValues]);

  const handleAdd = (value: string | null) => {
    if (value !== null) {
      // If the value doesn't exist in any of the column data, throw error.
      if (!allUniqueValues.has(value)) {
        setError(`Value "${value}" not found in dataset.`);
        return;
      }

      setError(null);
      if (!missingValues.some((mv) => mv.value === value)) {
        setMissingValues((prev) => [...prev, { value }]);
      }
      setInputValue('');
    }
  };

  const handleRemove = (valueToRemove: string) => {
    setMissingValues((prev) => prev.filter((mv) => mv.value !== valueToRemove));
  };

  const handleUpdateDescription = (value: string, description: string) => {
    setMissingValues((prev) =>
      prev.map((mv) => (mv.value === value ? { ...mv, description } : mv))
    );
  };

  const handleApplyToAll = (value: string) => {
    const stagedValue = missingValues.find((mv) => mv.value === value);
    if (stagedValue) {
      userAppliesGlobalMissingStatus([stagedValue]);
    }
  };

  const handleRemoveFromColumns = (value: string) => {
    userRemovesGlobalMissingStatus(value);
  };

  return {
    missingValues,
    availableSuggestions,
    inputValue,
    setInputValue,
    error,
    setError,
    handleAdd,
    handleRemove,
    handleUpdateDescription,
    handleApplyToAll,
    handleRemoveFromColumns,
  };
}
