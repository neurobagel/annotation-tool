import { Card, CardHeader, CardContent, Autocomplete, TextField } from '@mui/material';

interface ConfigCardProps {
  title: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
}

function ConfigCard({ title, options, value, onChange }: ConfigCardProps) {
  return (
    <div className="mx-auto w-full max-w-[1024px] rounded-3xl shadow-lg">
      <Card
        data-cy="config-card"
        className="rounded-3xl border-2 border-solid border-gray-300 text-center"
      >
        <CardHeader title={title} className="bg-gray-50 text-left" />
        <CardContent>
          <div className="flex flex-col items-center">
            <Autocomplete
              data-cy="config-card-dropdown"
              options={options}
              value={value}
              onChange={(_, newValue) => onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...params}
                  variant="outlined"
                  placeholder="Select a configuration option"
                />
              )}
              className="w-full max-w-md"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ConfigCard;
