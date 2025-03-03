/* eslint-disable react/no-unstable-nested-components */
// We need to disable this rule because the MUI Stepper API requires us to pass a component
// to the `slots.stepIcon` prop, and defining a simple function inline is the most
// straightforward way to achieve this. The performance impact is minimal in this case.
import { Stepper as MuiStepper, Step, StepLabel, StepConnector, useTheme } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ViewAgendaIcon from '@mui/icons-material/ViewAgenda';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { View } from '../utils/types';

const steps = [
  { label: 'Upload', view: View.Upload, icon: CloudUploadIcon },
  { label: 'Column Annotation', view: View.ColumnAnnotation, icon: ViewAgendaIcon },
  { label: 'Value Annotation', view: View.ValueAnnotation, icon: FactCheckIcon },
  { label: 'Download', view: View.Download, icon: CloudDownloadIcon },
];

function Stepper({ currentView }: { currentView: View }) {
  const theme = useTheme();
  const activeStep = steps.findIndex((step) => step.view === currentView);

  return (
    <div className="w-full p-4">
      <MuiStepper
        activeStep={activeStep}
        alternativeLabel
        connector={<StepConnector sx={{ top: 20 }} />}
        data-cy="stepper"
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
                    <step.icon
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
      </MuiStepper>
    </div>
  );
}

export default Stepper;
