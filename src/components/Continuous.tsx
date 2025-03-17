import { Paper } from '@mui/material';
import DescriptionEditor from './DescriptionEditor';

interface ContinuousProps {
  columnID: string;
  units: string;
  onUpdateUnits: (columnId: string, units: string) => void;
}

function Continuous({ columnID, units, onUpdateUnits }: ContinuousProps) {
  return (
    <Paper
      elevation={3}
      className="h-full items-center justify-center shadow-lg"
      data-cy={`${columnID}-continuous`}
    >
      <div className="p-6">
        <DescriptionEditor
          label="Units"
          columnID={columnID}
          description={units}
          onDescriptionChange={(id, newUnits) => {
            onUpdateUnits(id, newUnits || '');
          }}
        />
      </div>
    </Paper>
  );
}

export default Continuous;
