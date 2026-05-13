import { Alert, Autocomplete, TextField } from '@mui/material';
import { useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormatOption } from '../hooks/useFormatOptions';
import { validateContinuousValues } from '../utils/data-utils';
import DescriptionEditor from './DescriptionEditor';
import ValueTable from './ValueTable';

interface ContinuousProps {
  columnID: string;
  units: string;
  allValues: string[];
  uniqueValues: string[];
  missingValues: string[];
  formatId?: string | null;
  formatOptions: FormatOption[];

  showFormat?: boolean;
  showMissingToggle?: boolean;
  onUpdateUnits: (columnID: string, units: string) => void;
  onToggleMissingValue: (columnID: string, value: string, isMissing: boolean) => void;
  onUpdateFormat: (columnID: string, formatId: string | null) => void;
}

function Continuous({
  columnID,
  units,
  allValues,
  uniqueValues,
  missingValues,
  formatId = null,
  formatOptions,

  showFormat = true,
  showMissingToggle = false,
  onUpdateUnits,
  onToggleMissingValue,
  onUpdateFormat,
}: ContinuousProps) {
  const validationResult = useMemo(
    () => validateContinuousValues(allValues, missingValues, formatId),
    [allValues, missingValues, formatId]
  );

  const invalidValuesWithIds = useMemo(
    () =>
      validationResult?.invalidValues.map((val) => ({
        id: uuidv4(),
        val,
      })) || [],
    [validationResult?.invalidValues]
  );

  return (
    <ValueTable
      columnID={columnID}
      uniqueValues={uniqueValues}
      missingValues={missingValues}
      showMissingToggle={showMissingToggle}
      onToggleMissingValue={onToggleMissingValue}
      dataCy={`${columnID}-continuous`}
      tableClassName="min-w-full"
      rightSidebarContent={
        <div className="flex flex-col gap-4">
          <DescriptionEditor
            key={`${columnID}-units`}
            label="Units"
            columnID={columnID}
            description={units}
            onDescriptionChange={(id, newUnits) => {
              onUpdateUnits(id, newUnits || '');
            }}
          />

          {showFormat && (
            <div className="flex flex-col gap-2">
              <Autocomplete
                data-cy={`${columnID}-format-dropdown`}
                options={formatOptions}
                getOptionLabel={(option) => option.label}
                renderOption={(props, option) => (
                  <li {...props}>
                    <div>
                      <div>{option.label}</div>
                      {option.examples && (
                        <div className="text-xs text-gray-500">
                          Examples: {option.examples.join(', ')}
                        </div>
                      )}
                    </div>
                  </li>
                )}
                value={formatOptions.find((opt) => opt.id === formatId) || null}
                onChange={(_, newValue) => {
                  onUpdateFormat(columnID, newValue?.id ?? null);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Format" variant="outlined" fullWidth />
                )}
              />

              {validationResult && validationResult.invalidCount > 0 && (
                <Alert severity="warning" data-cy="continuous-warning-alert">
                  <div className="mb-2">
                    Format parsing failed for {validationResult.invalidCount} value(s). Minimum and
                    maximum values could not be computed. Please ensure the format matches the data,
                    or designate non-standard values as missing.
                  </div>
                  <details className="text-sm cursor-pointer">
                    <summary className="font-medium select-none outline-none">
                      View invalid values
                    </summary>
                    <div className="mt-2 font-mono p-2 rounded max-h-32 overflow-y-auto bg-black/5">
                      {invalidValuesWithIds.map(({ id, val }) => (
                        <div key={id}>{val}</div>
                      ))}
                    </div>
                  </details>
                </Alert>
              )}
              {validationResult && validationResult.invalidCount === 0 && (
                <Alert severity="info" data-cy="continuous-info-alert">
                  Min = {validationResult.min}, Max = {validationResult.max}
                </Alert>
              )}
            </div>
          )}
        </div>
      }
    />
  );
}

export default Continuous;
