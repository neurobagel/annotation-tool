import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import { TextField, Tooltip, Typography } from '@mui/material';
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
        minRows={1}
        size="small"
        value={editedDescription || ''}
        disabled={disabled}
        onChange={(e) => handleDescriptionChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        variant="outlined"
        placeholder={isFocused ? 'Enter column description...' : 'Add description...'}
        // Styling to make it look "flat" when inactive?
        className={`transition-all duration-200 ${!isFocused && !editedDescription ? 'opacity-70' : 'opacity-100'}`}
        slotProps={{
          input: {
            style: { willChange: 'min-height, max-height' },
            className: `transition-[min-height,max-height,background-color] duration-300 ease-in-out items-start ${
              !isFocused
                ? 'min-h-[2.5rem] max-h-[2.5rem] overflow-hidden bg-transparent'
                : 'min-h-[5rem] max-h-[15rem] overflow-y-auto bg-white'
            }`,
            endAdornment: (
              <>
                {saveStatus !== 'idle' && (
                  <Tooltip title={saveStatus === 'saving' ? 'Saving...' : 'Saved'}>
                    <div
                      className={`w-2 h-2 rounded-full mb-auto mt-2 ${
                        saveStatus === 'saved' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    />
                  </Tooltip>
                )}
                {saveStatus === 'idle' && !isFocused && !disabled && (
                  <Tooltip title="Click to expand">
                    <UnfoldMoreIcon
                      className="text-gray-400 mb-auto mt-1 transform rotate-45"
                      fontSize="small"
                    />
                  </Tooltip>
                )}
              </>
            ),
          },
        }}
      />
    </div>
  );
}

DescriptionEditor.defaultProps = defaultProps;

export default DescriptionEditor;
