import { useState } from 'react';
import { Box } from '@mui/material';
import { ColumnAnnotationInstructions } from '../../utils/instructions';
import { DataType } from '../../utils/internal_types';
import Instruction from '../Instruction';
import CompactColumnAnnotationCard from './CompactColumnAnnotationCard';
import { MockColumn } from './mock_types';

const MOCK_OPTIONS = [
  { id: 'nb:ParticipantID', label: 'Participant ID', disabled: false },
  { id: 'nb:Sex', label: 'Sex', disabled: false },
  { id: 'nb:Age', label: 'Age', disabled: false },
  { id: 'nb:Assessment', label: 'Assessment Tool', disabled: false },
  { id: 'nb:Diagnosis', label: 'Diagnosis', disabled: false },
];

const MOCK_COLUMNS = [
  {
    id: '1',
    name: 'participant_id',
    description: 'Unique identifier for the participant',
    dataType: null,
    standardizedVariableId: 'nb:ParticipantID',
    isDataTypeEditable: false, // Locked by var
    inferredDataTypeLabel: 'Identifier',
  },
  {
    id: '2',
    name: 'age_at_scan',
    description: '',
    dataType: 'Continuous' as DataType,
    standardizedVariableId: 'nb:Age',
    isDataTypeEditable: true,
    inferredDataTypeLabel: null,
  },
  {
    id: '3',
    name: 'sex',
    description: 'Binary sex of the subject. M = Male, F = Female',
    dataType: 'Categorical' as DataType,
    standardizedVariableId: 'nb:Sex',
    isDataTypeEditable: true,
    inferredDataTypeLabel: null,
  },
  {
    id: '4',
    name: 'long_column_name_that_might_break_layout_or_cause_issues_if_not_handled_properly_test_test_test',
    description:
      'This is a very long description that checks how the input field handles text overflow and if it expands or scrolls correctly within the compact layout.',
    dataType: null,
    standardizedVariableId: null,
    isDataTypeEditable: true,
    inferredDataTypeLabel: null,
  },
  {
    id: '5',
    name: 'diagnosis',
    description: null,
    dataType: 'Categorical' as DataType,
    standardizedVariableId: null, // Unassigned
    isDataTypeEditable: true,
    inferredDataTypeLabel: null,
  },
];

// ... imports

export default function PrototypePage() {
  // Local state to simulate store actions
  const [columns, setColumns] = useState<MockColumn[]>(MOCK_COLUMNS);

  const handleDescriptionChange = (id: string, newDesc: string | null) => {
    setColumns((cols) => cols.map((c) => (c.id === id ? { ...c, description: newDesc } : c)));
  };

  const handleDataTypeChange = (id: string, newType: 'Categorical' | 'Continuous' | null) => {
    let dt: DataType | null = null;
    if (newType === 'Categorical') dt = DataType.categorical;
    if (newType === 'Continuous') dt = DataType.continuous;
    setColumns((cols) => cols.map((c) => (c.id === id ? { ...c, dataType: dt } : c)));
  };

  const handleStandardizedVariableChange = (id: string, newVarId: string | null) => {
    setColumns((cols) =>
      cols.map((c) => {
        if (c.id !== id) return c;
        // Mock the store logic for locking types
        const isLocked = newVarId === 'nb:ParticipantID';
        return {
          ...c,
          standardizedVariableId: newVarId,
          isDataTypeEditable: !isLocked,
          dataType: isLocked ? null : c.dataType,
          inferredDataTypeLabel: isLocked ? 'Identifier' : null,
        };
      })
    );
  };

  return (
    <div
      className="flex flex-col items-center gap-6 h-[70vh] overflow-hidden"
      data-cy="column-annotation-container"
    >
      <div className="w-full max-w-7xl flex flex-col h-full">
        <div className="p-4 flex-shrink-0">
          <Instruction title="Column Annotation" className="mb-0">
            <ColumnAnnotationInstructions />
          </Instruction>
        </div>

        {/* Global Header Row - Sticky */}
        <Box
          className="sticky top-0 z-10 mx-4 mt-2 border border-blue-200 border-b-0 shadow-sm rounded-t-lg backdrop-blur-sm bg-opacity-95 bg-gray-50"
          sx={{ borderColor: 'grey.200' }}
        >
          {/* Row 1: Main Labels */}
          <div className="grid grid-cols-[1fr_140px_250px] gap-4 px-4 pt-3 pb-1 items-end border-b border-gray-200">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Description</span>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Data Type</span>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Mapped Variable</span>
          </div>


        </Box>

        {/* Scrollable Rows Container */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {columns.map((col) => (
            <div key={col.id} className="w-full">
              <CompactColumnAnnotationCard
                id={col.id}
                name={col.name}
                description={col.description}
                dataType={col.dataType}
                standardizedVariableId={col.standardizedVariableId}
                standardizedVariableOptions={MOCK_OPTIONS}
                isDataTypeEditable={col.isDataTypeEditable}
                inferredDataTypeLabel={col.inferredDataTypeLabel}
                onDescriptionChange={handleDescriptionChange}
                onDataTypeChange={handleDataTypeChange}
                onStandardizedVariableChange={handleStandardizedVariableChange}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
