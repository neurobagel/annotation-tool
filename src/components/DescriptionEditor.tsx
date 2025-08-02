import { TextField, Typography } from '@mui/material';
import { useState, useEffect, useCallback, useRef } from 'react';

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
  const [editedDescription, setEditedDescription] = useState<string | null>(description);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dataCy = levelValue ? `${columnID}-${levelValue}` : columnID;

  // Update local state when description prop changes
  useEffect(() => {
    setEditedDescription(description);
  }, [description]);

  // Debounced save function
  const debouncedSave = useCallback(
    (value: string | null) => {
      setSaveStatus('saving');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        onDescriptionChange(columnID, value);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 1500);
      }, 500);
    },
    [columnID, onDescriptionChange]
  );

  const handleDescriptionChange = (value: string) => {
    const newValue = value.trim() === '' ? null : value;
    setEditedDescription(newValue);
    debouncedSave(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Typography variant="subtitle1" className="font-bold text-gray-700">
          {label}
        </Typography>
      )}

      <TextField
        data-cy={`${dataCy}-description`}
        fullWidth
        multiline
        rows={3}
        value={editedDescription || ''}
        onChange={(e) => handleDescriptionChange(e.target.value)}
        variant="outlined"
        placeholder="Click to add description..."
        helperText={(() => {
          if (saveStatus === 'saving') return 'Saving...';
          if (saveStatus === 'saved') return 'Saved';
          return '';
        })()}
        slotProps={{
          formHelperText: {
            sx: {
              color: saveStatus === 'saved' ? 'success.main' : 'text.secondary',
              fontSize: '0.75rem',
            },
          },
        }}
      />
    </div>
  );
}

DescriptionEditor.defaultProps = defaultProps;

export default DescriptionEditor;
