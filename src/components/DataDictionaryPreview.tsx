import ReactJson from '@microlink/react-json-view';
import { Paper, useTheme } from '@mui/material';
import { DataDictionary } from '../../internal_types';

function DataDictionaryPreview({ dataDictionary }: { dataDictionary: DataDictionary }) {
  const theme = useTheme();

  return (
    <div className="mt-6" data-cy="datadictionary-preview">
      <Paper elevation={3} className="h-[450px] w-full overflow-x-auto shadow-lg">
        <div className="m-4">
          <ReactJson
            src={dataDictionary}
            collapsed={false}
            displayDataTypes={false}
            enableClipboard={false}
            style={{
              fontSize: '15px',
            }}
            theme={{
              base00: 'transparent',
              base01: theme.palette.text.primary,
              base02: theme.palette.divider,
              base03: theme.palette.text.disabled,
              base04: theme.palette.text.primary,
              base05: theme.palette.text.primary,
              base06: theme.palette.text.primary,
              base07: theme.palette.text.primary,
              base08: theme.palette.error.main,
              base09: theme.palette.primary.main,
              base0A: theme.palette.warning.main,
              base0B: theme.palette.success.main,
              base0C: theme.palette.info.main,
              base0D: theme.palette.primary.main,
              base0E: theme.palette.secondary.main,
              base0F: theme.palette.error.main,
            }}
            name={null}
            quotesOnKeys={false}
            collapseStringsAfterLength={50}
            displayObjectSize={false}
            indentWidth={2}
          />
        </div>
      </Paper>
    </div>
  );
}

export default DataDictionaryPreview;
