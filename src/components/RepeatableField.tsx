import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { TextField, Box, IconButton, Button } from '@mui/material';

export function ArrayPreviewDisplay({ values, dataCy }: { values: string[]; dataCy: string }) {
  const cleanValues = values.map((v) => v.trim()).filter((v) => v !== '');
  if (cleanValues.length === 0) return null;
  return (
    <Box className="bg-gray-100 p-2 rounded text-xs font-mono text-gray-700" data-cy={dataCy}>
      {`[${cleanValues.map((item) => JSON.stringify(item)).join(', ')}]`}
    </Box>
  );
}

export function RepeatableField({
  itemLabel,
  values,
  onChange,
  placeholder,
  dataCy,
}: {
  itemLabel: string;
  values: string[];
  onChange: (newValues: string[]) => void;
  placeholder?: string;
  dataCy?: string;
}) {
  const handleAdd = () => {
    onChange([...values, '']);
  };

  const handleRemove = (index: number) => {
    if (values.length === 1) {
      onChange(['']);
    } else {
      const newValues = [...values];
      newValues.splice(index, 1);
      onChange(newValues);
    }
  };

  const handleChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  return (
    <Box className="flex flex-col gap-2 w-full">
      {values.map((val, index) => (
        <Box key={index} className="flex flex-row items-center gap-2">
          <TextField
            label={`${itemLabel} ${index + 1}`}
            value={val}
            onChange={(e) => handleChange(index, e.target.value)}
            fullWidth
            size="small"
            placeholder={placeholder}
            data-cy={`${dataCy}-input-${index}`}
          />
          <IconButton
            onClick={() => handleRemove(index)}
            size="small"
            data-cy={`${dataCy}-remove-${index}`}
            title={`Remove ${itemLabel.toLowerCase()}`}
          >
            <DeleteIcon fontSize="small" className="text-gray-500" />
          </IconButton>
        </Box>
      ))}
      <Button
        startIcon={<AddIcon />}
        onClick={handleAdd}
        size="small"
        className="self-start text-blue-600"
        data-cy={`${dataCy}-add`}
      >
        Add {itemLabel}
      </Button>
    </Box>
  );
}
