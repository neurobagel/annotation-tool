import { useState } from 'react';
import { Fab, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

interface DescriptionEditorProps {
  description: string | null;
  onDescriptionChange: (id: number, description: string | null) => void;
  id: number;
}

function DescriptionEditor({ description, onDescriptionChange, id }: DescriptionEditorProps) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState<string | null>(description);

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleSaveDescription = () => {
    setIsEditingDescription(false);
    onDescriptionChange(id, editedDescription);
  };

  return isEditingDescription ? (
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <TextField
        data-cy={`${id}-description-input`}
        fullWidth
        multiline
        rows={3}
        value={editedDescription || ''}
        onChange={(e) => setEditedDescription(e.target.value)}
        variant="outlined"
        label="Description"
        className="flex-1"
      />
      <Fab
        data-cy={`${id}-save-description-button`}
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
        <Typography variant="subtitle1" className="mb-2 text-gray-700">
          Description:
        </Typography>
        <Typography data-cy={`${id}-description`} variant="body1" className="text-gray-700">
          {description || 'No description provided.'}
        </Typography>
      </div>
      <Fab
        data-cy={`${id}-edit-description-button`}
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

export default DescriptionEditor;
