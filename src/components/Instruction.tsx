import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Dialog, DialogTitle, DialogContent, IconButton, Button, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';

const animation = keyframes`
  0%    { transform: rotate( 0deg); }
  8%    { transform: rotate( 0deg); } /* short hold */
  20%   { transform: rotate(-18deg); }
  36%   { transform: rotate( 18deg); }
  52%   { transform: rotate(-12deg); }
  66%   { transform: rotate( 6deg); }
  78%   { transform: rotate(-3deg); }
  88%   { transform: rotate( 0deg); }
  100%  { transform: rotate( 0deg); }
`;

const AnimatedIcon = styled(InfoOutlinedIcon)(({ theme }) => ({
  animation: `${animation} 1.5s ease-in-out infinite`,
  transformOrigin: '50% 15%',
  color: theme.palette.primary.main,
}));

interface InstructionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const defaultProps = {
  className: '',
};

function Instruction({ title, children, className }: InstructionProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AnimatedIcon />}
        onClick={() => setOpen(true)}
        className={className}
        data-cy="instruction-button"
      >
        How to use this page
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        data-cy="instruction-dialog"
      >
        <DialogTitle className="flex justify-between items-center">
          {title}
          <IconButton onClick={() => setOpen(false)} data-cy="instruction-close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{children}</DialogContent>
      </Dialog>
    </>
  );
}

Instruction.defaultProps = defaultProps;
export default Instruction;
