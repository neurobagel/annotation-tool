import { Stepper, Step, StepLabel, StepConnector, useTheme, SvgIcon, Tooltip } from '@mui/material';
import { useUploadedDataTableFileName } from '../stores/data';
import useViewStore from '../stores/view';
import { steps } from '../utils/constants';
import { View } from '../utils/internal_types';

function NavStepper({ currentView }: { currentView: View }) {
  const theme = useTheme();
  const activeStep = steps.findIndex((step) => step.view === currentView);
  const setCurrentView = useViewStore((state) => state.setCurrentView);
  const isDataTableUploaded = useUploadedDataTableFileName() !== null;

  const handleStepClick = (stepIndex: number, stepView: View) => {
    if (!isDataTableUploaded && stepIndex > 0) {
      return;
    }
    setCurrentView(stepView);
  };

  return (
    <div className="w-full p-4">
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        nonLinear
        connector={<StepConnector sx={{ top: 20 }} />}
        data-cy="nav-stepper"
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& .MuiStepLabel-label': {
            fontSize: '1rem',
            fontWeight: 500,
            marginTop: '8px',
          },
        }}
      >
        {steps.map((step, index) => {
          let stepColor = '#9CA3AF';
          const isDisabled = !isDataTableUploaded && index > 0;
          const tooltipMessage = isDisabled ? 'Please upload a data table first' : '';

          if (index < activeStep) {
            stepColor = theme.palette.primary.light;
          } else if (index === activeStep) {
            stepColor = theme.palette.primary.main;
          }

          return (
            <Step key={step.label} data-cy={`${step.label}-step`}>
              <StepLabel
                onClick={() => handleStepClick(index, step.view)}
                sx={{
                  '& .MuiStepLabel-label': {
                    cursor: 'pointer',
                  },
                }}
                slots={{
                  stepIcon: () => (
                    <Tooltip title={tooltipMessage} arrow placement="top">
                      <SvgIcon
                        component={step.icon} // Wrap the icon in SvgIcon
                        sx={{
                          fontSize: 32,
                          color: stepColor,
                          cursor: 'pointer',
                        }}
                      />
                    </Tooltip>
                  ),
                }}
              >
                <Tooltip title={tooltipMessage} arrow placement="top">
                  <span>{step.label}</span>
                </Tooltip>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
}

export default NavStepper;
