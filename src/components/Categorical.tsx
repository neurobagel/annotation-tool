import { Autocomplete, TableCell, TextField, Tooltip } from '@mui/material';
import { matchSorter } from 'match-sorter';
import React, { forwardRef } from 'react';
import type { TermOption } from '~/hooks/useTermOptions';
import DescriptionEditor from './DescriptionEditor';
import ValueTable from './ValueTable';
import VirtualListbox from './VirtualListBox';

interface CategoricalProps {
  columnID: string;
  uniqueValues: string[];
  levels: { [key: string]: { description: string; standardizedTerm?: string } };
  missingValues: string[];
  termOptions: TermOption[];
  showStandardizedTerm?: boolean;
  showMissingToggle?: boolean;
  onUpdateDescription: (columnId: string, value: string, description: string) => void;
  onToggleMissingValue: (columnId: string, value: string, isMissing: boolean) => void;
  onUpdateLevelTerm: (columnId: string, value: string, termId: string | null) => void;
}

/**
 * Virtualized wrapper for MUI Autocomplete options to prevent React rendering bottlenecks.
 *
 * MUI creates React elements for all matched options upfront. This wrapper intercepts
 * that process by taking the lightweight <li> elements and only wrapping them in
 * expensive <Tooltip> components when they actually scroll into the visible DOM.
 *
 * Deferring tooltip generation drastically improves performance for thousands of options.
 */
const CategoricalVirtualListbox = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
  (props, ref) => {
    const { children, ...other } = props;
    const items = React.Children.toArray(children);

    return (
      <VirtualListbox ref={ref} itemCount={items.length} {...other}>
        {({ index, style }) => {
          const item = items[index] as React.ReactElement<{
            style?: React.CSSProperties;
            'data-tooltip-title'?: string;
            'data-tooltip-cy'?: string;
          }>;
          const tooltipTitle = item.props['data-tooltip-title'];
          const tooltipCy = item.props['data-tooltip-cy'];

          const clonedItem = React.cloneElement(item, {
            style: { ...item.props.style, ...style },
          });

          if (tooltipTitle) {
            return (
              <Tooltip
                title={tooltipTitle}
                placement="right"
                enterDelay={400}
                arrow
                slotProps={{
                  tooltip: {
                    ...({ 'data-cy': tooltipCy } as React.HTMLAttributes<HTMLDivElement>),
                    sx: { fontSize: '16px' },
                  },
                }}
              >
                {clonedItem}
              </Tooltip>
            );
          }

          return clonedItem;
        }}
      </VirtualListbox>
    );
  }
);

function Categorical({
  columnID,
  uniqueValues,
  levels,
  missingValues,
  termOptions,
  showStandardizedTerm = false,
  showMissingToggle = false,
  onUpdateDescription,
  onToggleMissingValue,
  onUpdateLevelTerm,
}: CategoricalProps) {
  const filterOptions = (items: TermOption[], { inputValue }: { inputValue: string }) =>
    matchSorter(items, inputValue, {
      keys: [
        (option) =>
          option.abbreviation ? `${option.abbreviation} - ${option.label}` : option.label,
      ],
      baseSort: (a, b) => a.index - b.index,
    });

  return (
    <ValueTable
      columnID={columnID}
      uniqueValues={uniqueValues}
      missingValues={missingValues}
      showMissingToggle={showMissingToggle}
      onToggleMissingValue={onToggleMissingValue}
      dataCy={`${columnID}-categorical`}
      extraTableHeadCells={
        <>
          <TableCell
            align="left"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              width: showStandardizedTerm ? '40%' : '80%',
            }}
          >
            Description
          </TableCell>
          {showStandardizedTerm && (
            <TableCell
              align="left"
              sx={{ fontWeight: 'bold', color: 'primary.main', width: '40%' }}
            >
              Standardized Term
            </TableCell>
          )}
        </>
      }
      renderExtraTableCells={(value) => (
        <>
          <TableCell align="left">
            <DescriptionEditor
              columnID={columnID}
              levelValue={value}
              description={levels[value]?.description || ''}
              onDescriptionChange={(id, description) => {
                onUpdateDescription(id, value, description || '');
              }}
            />
          </TableCell>
          {showStandardizedTerm && (
            <TableCell align="left">
              <Autocomplete
                disabled={missingValues.includes(value)}
                data-cy={`${columnID}-${value}-term-dropdown`}
                options={termOptions}
                getOptionLabel={(option: TermOption) =>
                  option.abbreviation ? `${option.abbreviation} - ${option.label}` : option.label
                }
                value={
                  termOptions.find((opt) => opt.id === levels[value]?.standardizedTerm) || null
                }
                onChange={(_, newValue) => {
                  onUpdateLevelTerm(columnID, value, newValue?.id ?? null);
                }}
                filterOptions={filterOptions}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" size="small" fullWidth />
                )}
                renderOption={(optionProps, option) => {
                  const { key, ...otherProps } = optionProps;
                  return (
                    <li
                      key={option.id}
                      {...otherProps}
                      data-cy={`${columnID}-${value}-term-dropdown-option`}
                      data-tooltip-title={option.label}
                      data-tooltip-cy={`${columnID}-${value}-term-tooltip`}
                    >
                      <div className="w-full truncate">{option.label}</div>
                    </li>
                  );
                }}
                slotProps={{
                  listbox: {
                    component: CategoricalVirtualListbox,
                  },
                  paper: {
                    sx: {
                      width: 'max-content',
                      minWidth: '500px',
                    },
                  },
                }}
              />
            </TableCell>
          )}
        </>
      )}
    />
  );
}

export default Categorical;
