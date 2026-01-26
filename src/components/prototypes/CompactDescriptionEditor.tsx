/* eslint-disable react/require-default-props */
import { TextField, Tooltip } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface CompactDescriptionEditorProps {
  description: string | null;
  onDescriptionChange: (columnID: string, description: string | null) => void;
  columnID: string;
  levelValue?: string;
  disabled?: boolean;
}

function CompactDescriptionEditor({
  description,
  onDescriptionChange,
  columnID,
  levelValue = '',
  disabled = false,
}: CompactDescriptionEditorProps) {
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
    <div className="flex w-full items-center">
      <TextField
        data-cy={`${dataCy}-description`}
        fullWidth
        size="small"
        value={editedDescription || ''}
        disabled={disabled}
        onChange={(e) => handleDescriptionChange(e.target.value)}
        variant="outlined"
        placeholder="Add description..."
        InputProps={{
          endAdornment: saveStatus !== 'idle' && (
            <Tooltip title={saveStatus === 'saving' ? 'Saving...' : 'Saved'}>
              <div
                className={`w-2 h-2 rounded-full ${saveStatus === 'saved' ? 'bg-green-500' : 'bg-yellow-500'}`}
              />
            </Tooltip>
          ),
        }}
      />
    </div>
  );
}

export default CompactDescriptionEditor;
