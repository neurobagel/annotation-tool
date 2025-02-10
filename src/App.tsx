import { useState } from 'react';
import { Button, Container } from '@mui/material';
import ProgressStepper from './components/ProgressStepper';
import ColumnAnnotationTable from './components/ColumnAnnotationTable';
import StatusBar from './components/StatusBar';
import StatusBar1 from './components/StatusBar1';
import StatusBar2 from './components/StatusBar2';

const App = () => {
  const [activeStep, setActiveStep] = useState(1);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: 20 }}>
      
      <ProgressStepper activeStep={activeStep} />

      
      {activeStep === 1 && <ColumnAnnotationTable />}

      
      <div style={{ marginTop: 20, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          disabled={activeStep === 0}
          style={{ marginRight: 10 }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          disabled={activeStep === 3}
        >
          Next
        </Button>
      </div>
      <StatusBar />
      <StatusBar1 />
      <StatusBar2 />
    </Container>
  );
};

export default App;