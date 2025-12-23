import { TextField, Typography } from '@mui/material';
import { useState, useEffect, useCallback, useRef } from 'react';

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Track a pending debounced save so we can flush it on unmount.
  const pendingSaveRef = useRef(false);
  const latestValueRef = useRef<string | null>(description);
  const disabledRef = useRef(disabled);
  const onDescriptionChangeRef = useRef(onDescriptionChange);
  const dataCy = levelValue ? `${columnID}-${levelValue}` : columnID;

  disabledRef.current = disabled;
  onDescriptionChangeRef.current = onDescriptionChange;

  // Reset component state when the prop changes (e.g., missing toggle).
  useEffect(() => {
    setEditedDescription(description);
    latestValueRef.current = description;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    pendingSaveRef.current = false;
    setSaveStatus('idle');
  }, [description, disabled]);

  // Run any pending save on unmount so fast column switches don't drop edits.
  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (pendingSaveRef.current && !disabledRef.current) {
        onDescriptionChangeRef.current(columnID, latestValueRef.current);
      }
    },
    [columnID]
  );

  /* 
  This function ensures that we only update the description after the user stops typing
  When a user types, start a timer before storing the current value. 
  If they type again before the timer expires, create a new timer and begin waiting again.
  */
  const debouncedSave = useCallback(
    (value: string | null) => {
      if (disabled) {
        return;
      }
      pendingSaveRef.current = true;
      latestValueRef.current = value;
      setSaveStatus('saving');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        onDescriptionChange(columnID, value);
        pendingSaveRef.current = false;
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 1500);
      }, 500);
    },
    [columnID, disabled, onDescriptionChange]
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
