import { TextField, Typography } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

const defaultProps = {
  label: null,
  levelValue: null,
  disabled: false,
};

interface DescriptionEditorProps {
  label?: string;
  description: string | null;
  onDescriptionChange: (columnID: string, description: string | null) => void;
  columnID: string;
  levelValue?: string;
  disabled?: boolean;
}

function DescriptionEditor({
  label,
  description,
  onDescriptionChange,
  columnID,
  levelValue,
  disabled = false,
}: DescriptionEditorProps) {
  const [editedDescription, setEditedDescription] = useState<string | null>(description);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  // Track the transient "Saved" helper state so it can be cleared on a timer.
  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dataCy = levelValue ? `${columnID}-${levelValue}` : columnID;

  // Debounce saves so we only persist after the user pauses typing.
  const debouncedSave = useDebouncedCallback((value: string | null) => {
    onDescriptionChange(columnID, value);
    setSaveStatus('saved');
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }
    statusTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 1500);
  }, 500);

  // Reset component state when the prop changes (e.g., missing toggle).
  useEffect(() => {
    setEditedDescription(description);
    debouncedSave.cancel();
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
      statusTimeoutRef.current = null;
    }
    setSaveStatus('idle');
  }, [description, disabled, debouncedSave]);

  // Flush any pending save on unmount so fast column switches don't drop edits.
  useEffect(
    () => () => {
      if (disabled) {
        debouncedSave.cancel();
      } else {
        debouncedSave.flush();
      }
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    },
    [debouncedSave, disabled]
  );

  const handleDescriptionChange = (value: string) => {
    const newValue = value.trim() === '' ? null : value;
    setEditedDescription(newValue);
    if (disabled) {
      return;
    }
    setSaveStatus('saving');
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
        disabled={disabled}
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
