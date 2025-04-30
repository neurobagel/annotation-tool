import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Autocomplete,
  TextField,
} from '@mui/material';
import { useEffect } from 'react';
import diagnosisTerms from '../assets/diagnosisTerms.json';
import { useTablePagination } from '../hooks';
import { StandardizedVariable } from '../utils/types';
import DescriptionEditor from './DescriptionEditor';
import MissingValueButton from './MissingValueButton';

const sexTerms = [
  { label: 'Male', identifier: 'snomed:248153007' },
  { label: 'Female', identifier: 'snomed:248152002' },
  { label: 'Other', identifier: 'snomed:32570681000036106' },
];

interface CategoricalProps {
  columnID: string;
  uniqueValues: string[];
  levels: { [key: string]: { description: string; label?: string; termURL?: string } };
  missingValues: string[];
  standardizedVariable?: StandardizedVariable | null;
  onUpdateDescription: (columnId: string, value: string, description: string) => void;
  onToggleMissingValue: (columnId: string, value: string, isMissing: boolean) => void;
  onUpdateLevelTerm: (
    columnId: string,
    value: string,
    term: { identifier: string; label: string } | null
  ) => void;
}

const defaultProps = {
  standardizedVariable: null,
};

function Categorical({
  columnID,
  uniqueValues,
  levels,
  missingValues,
  standardizedVariable,
  onUpdateDescription,
  onToggleMissingValue,
  onUpdateLevelTerm,
}: CategoricalProps) {
  const { page, setPage, rowsPerPage, handleChangePage, handleChangeRowsPerPage } =
    useTablePagination(5);

  useEffect(() => {
    setPage(0);
  }, [columnID, setPage]);

  const slicedValues = uniqueValues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getTermOptions = () => {
    if (standardizedVariable?.identifier === 'nb:Diagnosis') {
      return diagnosisTerms;
    }
    if (standardizedVariable?.identifier === 'nb:Sex') {
      return sexTerms;
    }
    return [];
  };

  const termOptions = getTermOptions();

  return (
    <TableContainer
      data-cy={`${columnID}-categorical`}
      component={Paper}
      elevation={3}
      className="h-full shadow-lg"
    >
      <Table className="min-w-[768px]">
        <TableHead data-cy={`${columnID}-categorical-table-head`}>
          <TableRow className="bg-blue-50">
            <TableCell align="left" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Value
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Description
            </TableCell>
            {standardizedVariable && (
              <TableCell align="left" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Standardized Term
              </TableCell>
            )}
            {standardizedVariable && (
              <TableCell align="left" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Missing Value
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {slicedValues.map((value) => (
            <TableRow key={`${columnID}-${value}`} data-cy={`${columnID}-${value}`}>
              <TableCell align="left">{value}</TableCell>
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
              {standardizedVariable && (
                <TableCell align="left">
                  <Autocomplete
                    options={termOptions}
                    getOptionLabel={(option) => option.label}
                    value={
                      termOptions.find((opt) => opt.identifier === levels[value]?.termURL) || null
                    }
                    onChange={(_, newValue) => {
                      onUpdateLevelTerm(columnID, value, newValue);
                    }}
                    renderInput={(params) => (
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      <TextField {...params} variant="standard" size="small" fullWidth />
                    )}
                  />
                </TableCell>
              )}
              {standardizedVariable && (
                <TableCell align="left">
                  <MissingValueButton
                    value={value}
                    columnId={columnID}
                    missingValues={missingValues}
                    onToggleMissingValue={onToggleMissingValue}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        data-cy={`${columnID}-categorical-pagination`}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={uniqueValues.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

Categorical.defaultProps = defaultProps;

export default Categorical;
