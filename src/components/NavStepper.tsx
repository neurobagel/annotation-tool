import { Stepper, Step, StepLabel, StepConnector, useTheme, SvgIcon } from '@mui/material';
import { steps } from '../utils/constants';
import { View } from '../utils/internal_types';

function NavStepper({ currentView }: { currentView: View }) {
  const theme = useTheme();
  const activeStep = steps.findIndex((step) => step.view === currentView);

  return (
    <div className="w-full p-4">
      <Stepper
        activeStep={activeStep}
        alternativeLabel
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

          if (index < activeStep) {
            stepColor = theme.palette.primary.light;
          } else if (index === activeStep) {
            stepColor = theme.palette.primary.main;
          }

          return (
            <Step key={step.label} data-cy={`${step.label}-step`}>
              <StepLabel
                slots={{
                  stepIcon: () => (
                    <SvgIcon
                      component={step.icon} // Wrap the icon in SvgIcon
                      sx={{
                        fontSize: 32,
                        color: stepColor,
                      }}
                    />
                  ),
                }}
              >
                {step.label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
}

export default NavStepper;
