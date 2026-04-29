import { useTheme } from '@mui/material/styles';
import Joyride, { CallBackProps, EVENTS, STATUS, Step } from 'react-joyride';
import useSessionStore from '~/stores/session';

interface ColumnAnnotationTourProps {
  firstCollectionVarId: string | null;
}

export default function ColumnAnnotationTour({ firstCollectionVarId }: ColumnAnnotationTourProps) {
  const theme = useTheme();
  const { hasSeenColumnAnnotationTour, setHasSeenColumnAnnotationTour } = useSessionStore();

  const steps: Step[] = [
    {
      target: '[data-tour="tour-page-container"]',
      content:
        'Welcome to the Neurobagel Annotation tool. On this page, you can review the columns in your data table and explain what information they contain by mapping them to the appropriate standardized variables on the right. You can also specify the type of data (categorical or continuous) in each column.',
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '[data-tour="tour-column-list"]',
      content:
        'This is the list of your columns. You can add a description for each column and view the mapped data type and standardized variable. You can select a column by clicking on it, and then map the column to a standardized variable on the right by clicking the name of the variable. To select multiple columns to map, use CTRL+click or SHIFT+click.',
      placement: 'top',
      floaterProps: {
        disableFlip: true,
      },
    },
    {
      target: '[data-tour="tour-standardized-variables-list"]',
      content:
        'This is the standardized variable list. While you have one or more columns selected, click on the corresponding standardized variable to map your column to the variable.',
      placement: 'left',
    },
  ];

  if (firstCollectionVarId) {
    steps.push({
      target: `[data-cy="collection-item-${firstCollectionVarId}"]`,
      content:
        'This is a list of recognized assessment tools. To map one or more selected columns to an assessment tool, click on the term from this list that best matches the assessment. You can filter the list of assessment tools using the search bar directly above.',
      placement: 'left',
    });
  }

  steps.push(
    {
      target: '[data-tour="tour-search-filter"]',
      content: 'This is the search bar. Use it to quickly filter columns in your table by name.',
      placement: 'bottom',
    },
    {
      target: '[data-tour="tour-bulk-action-bar"]',
      content:
        'This is the action bar. Use it to assign a data type to all currently selected columns, or to clear the existing mappings (data type and standardized variable).',
      placement: 'bottom',
    }
  );

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, step } = data;

    // Manually scroll the target into the center of the viewport to prevent sticky headers from hiding it
    if (type === EVENTS.STEP_BEFORE && step.target && typeof step.target === 'string') {
      const targetEl = document.querySelector(step.target);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setHasSeenColumnAnnotationTour(true);
    }
  };

  const runTour = !hasSeenColumnAnnotationTour;

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: theme.palette.primary.main,
          zIndex: 10000,
        },
      }}
    />
  );
}
