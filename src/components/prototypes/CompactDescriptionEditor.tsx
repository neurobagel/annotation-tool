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
  const [isFocused, setIsFocused] = useState(false);

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
    <div className="flex w-full flex-col gap-1">
      {/* Label removed - handled by Global Header in Floating Rows layout */}
      <TextField
        data-cy={`${dataCy}-description`}
        fullWidth
        multiline
        // Expand when focused or if there is substantial content (optional, but focus is safer for "compactness")
        minRows={1}
        size="small"
        value={editedDescription || ''}
        disabled={disabled}
        onChange={(e) => handleDescriptionChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        variant="outlined"
        placeholder={isFocused ? "Enter column description..." : "Add description..."}
        // Styling to make it look "flat" when inactive?
        className={`transition-all duration-200 ${!isFocused && !editedDescription ? 'opacity-70' : 'opacity-100'}`}
        InputProps={{
          classes: {
            root: `transition-all duration-300 ease-in-out items-start ${!isFocused
                ? 'min-h-[2.5rem] max-h-[2.5rem] overflow-hidden bg-transparent'
                : 'min-h-[5rem] bg-white'
              }`,
          },
          endAdornment: saveStatus !== 'idle' && (
            <Tooltip title={saveStatus === 'saving' ? 'Saving...' : 'Saved'}>
              <div
                className={`w-2 h-2 rounded-full mb-auto mt-2 ${saveStatus === 'saved' ? 'bg-green-500' : 'bg-yellow-500'}`}
              />
            </Tooltip>
          ),
        }}
      />
    </div>
  );
}

export default CompactDescriptionEditor;
