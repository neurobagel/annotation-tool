import { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  CheckCircle,
  Warning,
  RadioButtonUnchecked,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

const StatusBar = () => {
  // State for the active stage and step
  const [activeStage, setActiveStage] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isStepsExpanded, setIsStepsExpanded] = useState(true);

  // Define the stages and their steps
  const stages = [
    {
      name: "Upload",
      steps: ["Upload Data Table", "Upload Data Dictionary"],
      status: "in-progress", // Stage status
    },
    {
      name: "Column Annotation",
      steps: Array(11).fill("Column Step"), // 11 columns
      status: "not-started", // Stage status
    },
    {
      name: "Value Annotation",
      steps: Array(11).fill("Value Step"), // 11 columns
      status: "not-started", // Stage status
    },
    {
      name: "Download",
      steps: ["Validate", "Review", "Download"],
      status: "not-started", // Stage status
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

  // Get step status (mock implementation)
  const getStepStatus = (stageIndex, stepIndex) => {
    if (stageIndex < activeStage) return "completed";
    if (stageIndex > activeStage) return "not-started";
    if (stepIndex < activeStep) return "completed";
    if (stepIndex === activeStep) return "in-progress";
    return "not-started";
  };

  // Get stage status (mock implementation)
  const getStageStatus = (stageIndex) => {
    if (stageIndex < activeStage) return "completed";
    if (stageIndex > activeStage) return "not-started";
    return "in-progress";
  };

  // Get progress percentage for a stage
  const getStageProgress = (stageIndex) => {
    if (stageIndex < activeStage) return 100;
    if (stageIndex > activeStage) return 0;
    return ((activeStep + 1) / stages[activeStage].steps.length) * 100;
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", padding: 4 }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        {/* Higher-level stepper for stages */}
        <Stepper activeStep={activeStage} alternativeLabel sx={{ mb: 4 }}>
          {stages.map((stage, index) => {
            const stageStatus = getStageStatus(index);
            return (
              <Step key={stage.name}>
                <StepLabel
                  onClick={() => handleStageClick(index)}
                  sx={{ cursor: "pointer" }}
                  icon={
                    stageStatus === "completed" ? (
                      <CheckCircle color="success" />
                    ) : stageStatus === "in-progress" ? (
                      <Warning color="warning" />
                    ) : (
                      <RadioButtonUnchecked color="disabled" />
                    )
                  }
                >
                  {stage.name}
                </StepLabel>
              </Step>
            );
          })}
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {stages[activeStage].steps.map((step, index) => {
                const stepStatus = getStepStatus(activeStage, index);
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1,
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      backgroundColor:
                        stepStatus === "in-progress" ? "#f5f5f5" : "transparent",
                    }}
                  >
                    <Chip
                      label={stepStatus.toUpperCase()}
                      color={
                        stepStatus === "completed"
                          ? "success"
                          : stepStatus === "in-progress"
                          ? "warning"
                          : "default"
                      }
                      size="small"
                    />
                    <Typography variant="body1">{step}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        </Box>

        {/* Progress indicator for the current stage */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Progress for {stages[activeStage].name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CircularProgress
              variant="determinate"
              value={getStageProgress(activeStage)}
              size={60}
            />
            <Typography variant="body1">
              {Math.round(getStageProgress(activeStage))}% Complete
            </Typography>
          </Box>
        </Box>

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

export default StatusBar;