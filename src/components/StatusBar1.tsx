import { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Chip,
  IconButton,
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess, CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";

const StatusBar1 = () => {
  // State for the active stage and step
  const [activeStage, setActiveStage] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isStepsExpanded, setIsStepsExpanded] = useState(true);

  // Define the stages and their steps
  const stages = [
    {
      name: "Upload",
      steps: ["Upload Data Table", "Upload Data Dictionary"],
    },
    {
      name: "Column Annotation",
      steps: [
        "Add Column Description",
        "Select Column Type",
        "Map Column to Standardized Term",
      ],
    },
    {
      name: "Value Annotation",
      steps: ["Value Annotation Step 1", "Value Annotation Step 2"], // Placeholder steps
    },
    {
      name: "Download",
      steps: ["Validate", "Review", "Download"],
    },
  ];

  // Handle next and previous actions for the steps
  const handleNext = () => {
    if (activeStep < stages[activeStage].steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    } else if (activeStage < stages.length - 1) {
      setActiveStage((prevStage) => prevStage + 1);
      setActiveStep(0);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    } else if (activeStage > 0) {
      setActiveStage((prevStage) => prevStage - 1);
      setActiveStep(stages[activeStage - 1].steps.length - 1);
    }
  };

  // Handle stage click to navigate between stages
  const handleStageClick = (stageIndex) => {
    setActiveStage(stageIndex);
    setActiveStep(0); // Reset to the first step of the selected stage
  };

  // Toggle steps visibility
  const toggleStepsExpanded = () => {
    setIsStepsExpanded((prev) => !prev);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        {/* Higher-level stepper for stages */}
        <Stepper activeStep={activeStage} alternativeLabel sx={{ mb: 4 }}>
          {stages.map((stage, index) => (
            <Step key={stage.name}>
              <StepLabel
                onClick={() => handleStageClick(index)}
                sx={{ cursor: "pointer" }}
              >
                {stage.name}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Collapsible steps section */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              mb: 2,
            }}
            onClick={toggleStepsExpanded}
          >
            <Typography variant="h6">
              Steps for {stages[activeStage].name}
            </Typography>
            <IconButton>
              {isStepsExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={isStepsExpanded}>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              }}
            >
              {stages[activeStage].steps.map((step, index) => (
                <Card
                  key={step}
                  onClick={() => setActiveStep(index)}
                  sx={{
                    cursor: "pointer",
                    border:
                      activeStep === index
                        ? "2px solid #1976d2"
                        : "1px solid #e0e0e0",
                    boxShadow: activeStep === index ? 3 : 1,
                    transition: "all 0.3s ease",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      {activeStep === index ? (
                        <CheckCircle color="primary" />
                      ) : (
                        <RadioButtonUnchecked color="disabled" />
                      )}
                      <Typography variant="subtitle1">{step}</Typography>
                    </Box>
                    <Chip
                      label={
                        activeStep === index ? "In Progress" : "Not Started"
                      }
                      color={activeStep === index ? "primary" : "default"}
                      size="small"
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Collapse>
        </Box>

        {/* Display the current step content */}
        <Typography variant="h6" sx={{ mb: 2 }}>
          Current Step: {stages[activeStage].steps[activeStep]}
        </Typography>

        {/* Navigation buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            disabled={activeStage === 0 && activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              activeStage === stages.length - 1 &&
              activeStep === stages[activeStage].steps.length - 1
            }
          >
            {activeStage === stages.length - 1 &&
            activeStep === stages[activeStage].steps.length - 1
              ? "Finish"
              : "Next"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default StatusBar1;