import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  LinearProgress,
  Typography,
} from '@mui/material';

const columns = [
  'participant_id',
  'age',
  'sex',
  'group',
  'group_dx',
  'number_comorbid_dx',
  'iq',
  'session',
];

const dataTypes = ['categorical', 'continuous'];
const standardizedVariables = [
  'Subject ID',
  'Session ID',
  'Age',
  'Sex',
  'Diagnosis',
  'Assessment Tool',
];

const ColumnAnnotationTable = () => {
  const [annotations, setAnnotations] = useState(
    columns.map((column) => ({
      column,
      description: '',
      dataType: '',
      standardizedVariable: '',
    }))
  );

  const handleDescriptionChange = (index, value) => {
    const updatedAnnotations = [...annotations];
    updatedAnnotations[index].description = value;
    setAnnotations(updatedAnnotations);
  };

  const handleDataTypeChange = (index, value) => {
    const updatedAnnotations = [...annotations];
    updatedAnnotations[index].dataType = value;
    setAnnotations(updatedAnnotations);
  };

  const handleStandardizedVariableChange = (index, value) => {
    const updatedAnnotations = [...annotations];
    updatedAnnotations[index].standardizedVariable = value;
    setAnnotations(updatedAnnotations);
  };

  const calculateProgress = () => {
    const completed = annotations.filter(
      (annotation) =>
        annotation.description !== '' &&
        annotation.dataType !== '' &&
        annotation.standardizedVariable !== ''
    ).length;
    return (completed / columns.length) * 100;
  };

  const completedAnnotations = annotations.filter(
    (annotation) =>
      annotation.description !== '' &&
      annotation.dataType !== '' &&
      annotation.standardizedVariable !== ''
  ).length;

  return (
    <div style={{ margin: '' }}>
      <LinearProgress
        variant="determinate"
        value={calculateProgress()}
        style={{ marginBottom: 10 }}
      />

      <Typography variant="body1" style={{ marginBottom: 20, textAlign: 'center' }}>
        {completedAnnotations} / {columns.length} columns annotated (
        {Math.round(calculateProgress())}% progress)
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Column</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Data Type</TableCell>
              <TableCell>Standardized Variable</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {annotations.map((annotation, index) => (
              <TableRow key={annotation.column}>
                <TableCell>{annotation.column}</TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={annotation.description}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Select
                    fullWidth
                    value={annotation.dataType}
                    onChange={(e) =>
                      handleDataTypeChange(index, e.target.value)
                    }
                  >
                    {dataTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    fullWidth
                    value={annotation.standardizedVariable}
                    onChange={(e) =>
                      handleStandardizedVariableChange(index, e.target.value)
                    }
                  >
                    {standardizedVariables.map((variable) => (
                      <MenuItem key={variable} value={variable}>
                        {variable}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ColumnAnnotationTable;