import { useState } from "react";
import {
  Collapse,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const StatusBar = () => {
  // State for the active stage and step
  const [activeStage, setActiveStage] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [isSecondaryBarOpen, setIsSecondaryBarOpen] = useState(true);

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

  // Toggle secondary bar visibility
  const toggleSecondaryBar = () => {
    setIsSecondaryBarOpen((prev) => !prev);
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

        {/* Collapsible secondary bar for steps within the current stage */}
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              mb: 1,
            }}
            onClick={toggleSecondaryBar}
          >
            <Typography variant="h6">
              Steps for {stages[activeStage].name}
            </Typography>
            <IconButton>
              {isSecondaryBarOpen ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          <Collapse in={isSecondaryBarOpen}>
            {/* Tabs for steps */}
            <Tabs
              value={activeStep}
              onChange={(event, newValue) => setActiveStep(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              {stages[activeStage].steps.map((step, index) => (
                <Tab key={step} label={step} />
              ))}
            </Tabs>

            {/* Accordion for steps */}
            <Accordion expanded={isSecondaryBarOpen}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="steps-content"
                id="steps-header"
              >
                <Typography>Steps Details</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {stages[activeStage].steps.map((step, index) => (
                    <ListItem
                      key={step}
                      button
                      selected={activeStep === index}
                      onClick={() => setActiveStep(index)}
                    >
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
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

export default StatusBar;