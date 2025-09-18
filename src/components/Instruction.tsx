import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Card, CardContent, CardHeader, Collapse, Typography } from '@mui/material';
import { useState } from 'react';

const defaultProps = {
  defaultExpanded: false,
  className: '',
};

interface InstructionProps {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

function Instruction({ children, defaultExpanded = false, className }: InstructionProps) {
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  return (
    <Card elevation={0} className={`border border-gray-200 ${className || ''}`}>
      <CardHeader
        avatar={<InfoOutlinedIcon color="primary" />}
        title={
          <Typography variant="subtitle1" className="font-semibold">
            Instructions
          </Typography>
        }
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer select-none"
        aria-expanded={expanded}
        role="button"
      />
      <Collapse in={expanded} timeout={400} unmountOnExit>
        <CardContent>{children}</CardContent>
      </Collapse>
    </Card>
  );
}

Instruction.defaultProps = defaultProps;

export default Instruction;
