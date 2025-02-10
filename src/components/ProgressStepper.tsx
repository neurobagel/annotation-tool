import { Stepper, Step, StepLabel } from '@mui/material';

const steps = ['Upload', 'Column Annotation', 'Value Annotation', 'Download'];

const ProgressStepper = ({ activeStep }) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel style={{ marginBottom: 20 }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default ProgressStepper;