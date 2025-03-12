import { useState } from 'react';
import { Fab, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const defaultProps = {
  label: null,
  levelValue: null,
};

interface DescriptionEditorProps {
  label?: string;
  description: string | null;
  onDescriptionChange: (columnID: string, description: string | null) => void;
  columnID: string;
  levelValue?: string;
}

function DescriptionEditor({
  label,
  description,
  onDescriptionChange,
  columnID,
  levelValue,
}: DescriptionEditorProps) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState<string | null>(description);
  const dataCy = levelValue ? `${columnID}-${levelValue}` : columnID;

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleSaveDescription = () => {
    setIsEditingDescription(false);
    onDescriptionChange(columnID, editedDescription);
  };

  return isEditingDescription ? (
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <TextField
        data-cy={`${dataCy}-description-input`}
        fullWidth
        multiline
        rows={3}
        value={editedDescription || ''}
        onChange={(e) => setEditedDescription(e.target.value)}
        variant="outlined"
        label={label || 'Description'}
        className="flex-1"
      />
      <Fab
        data-cy={`${dataCy}-save-description-button`}
        color="secondary"
        onClick={handleSaveDescription}
        size="small"
        className="mt-4 md:mt-0"
      >
        <SaveIcon />
      </Fab>
    </div>
  ) : (
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <div className="flex-1">
        {label && (
          <Typography variant="subtitle1" className="mb-2 text-gray-700">
            {label}
          </Typography>
        )}

        <Typography data-cy={`${dataCy}-description`} variant="body1" className="text-gray-700">
          {description || 'No description provided.'}
        </Typography>
      </div>
      <Fab
        data-cy={`${dataCy}-edit-description-button`}
        color="primary"
        onClick={handleEditDescription}
        size="small"
        className="mt-4 md:mt-0"
      >
        <EditIcon />
      </Fab>
    </div>
  );
}

DescriptionEditor.defaultProps = defaultProps;

export default DescriptionEditor;
