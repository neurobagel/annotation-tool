import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  TextField,
} from '@mui/material';
import useDataStore from '~/stores/data';
import diagnosisTerms from '../assets/diagnosisTerms.json';
import { StandardizedVariable } from '../utils/types';
import DescriptionEditor from './DescriptionEditor';
import MissingValueButton from './MissingValueButton';

// TODO: Remove this when the terms are fetched from the config
const sexTerms = [
  { label: 'Male', identifier: 'snomed:248153007' },
  { label: 'Female', identifier: 'snomed:248152002' },
  { label: 'Other', identifier: 'snomed:32570681000036106' },
];

// Manually add the healthy control term
diagnosisTerms.push({ label: 'Healthy Control', identifier: 'ncit:C94342' });

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
  const { getAssessmentToolConfig } = useDataStore();

  const showStandardizedTerm =
    standardizedVariable &&
    standardizedVariable?.identifier !== getAssessmentToolConfig().identifier;

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

  // TODO: Move this function to the store once the config functionality is implemented
  const getTermByURL = (termURL: string | undefined) => {
    if (!termURL) return null;
    return termOptions.find((opt) => opt.identifier === termURL) || null;
  };

  return (
    <TableContainer
      id={`${columnID}-table-container`}
      component={Paper}
      elevation={3}
      className="h-full shadow-lg overflow-auto"
      style={{ maxHeight: '500px' }}
      data-cy={`${columnID}-categorical`}
    >
      <Table stickyHeader className="min-w-[768px]">
        <TableHead data-cy={`${columnID}-categorical-table-head`}>
          <TableRow className="bg-blue-50">
            <TableCell align="left" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Value
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Description
            </TableCell>
            {showStandardizedTerm && (
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
          {uniqueValues.map((value) => (
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
              {showStandardizedTerm && (
                <TableCell align="left">
                  <Autocomplete
                    data-cy={`${columnID}-${value}-term-dropdown`}
                    options={termOptions}
                    getOptionLabel={(option) => option.label}
                    value={getTermByURL(levels[value]?.termURL)}
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
    </TableContainer>
  );
}

Categorical.defaultProps = defaultProps;

export default Categorical;
