import { Autocomplete, TextField } from '@mui/material';
import { FormatOption } from '~/hooks/useFormatOptions';
import DescriptionEditor from './DescriptionEditor';
import ValueTable from './ValueTable';

interface ContinuousProps {
  columnID: string;
  units: string;
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
        <>
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
          )}
        </>
      }
    />
  );
}

export default Continuous;
