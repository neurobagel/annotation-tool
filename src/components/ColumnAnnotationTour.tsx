import { useTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import Joyride, { CallBackProps, EVENTS, STATUS, Step } from 'react-joyride';
import { useStandardizedVariableOptions } from '~/hooks/useStandardizedVariableOptions';
import useSessionStore from '~/stores/session';
import { VariableType } from '~/utils/internal_types';

export default function ColumnAnnotationTour() {
  const theme = useTheme();
  const { hasSeenColumnAnnotationTour, setHasSeenColumnAnnotationTour } = useSessionStore();
  const standardizedVariableOptions = useStandardizedVariableOptions();

  // Find the first collection variable to highlight its specific section in the tour
  const firstCollectionVarId = useMemo(() => {
    const collectionVars = standardizedVariableOptions.filter(
      (opt) => opt.variable_type === VariableType.collection
    );
    return collectionVars.length > 0 ? collectionVars[0].id : null;
  }, [standardizedVariableOptions]);

  const steps = useMemo(() => {
    const baseSteps: Step[] = [
      {
        target: '[data-tour="tour-page-container"]',
        content:
          'Welcome to Column Annotation. This page allows you to review your dataset columns, specify their data types, and map them to standardized variables.',
        disableBeacon: true,
        placement: 'center',
      },
      {
        target: '[data-tour="tour-search-filter"]',
        content: 'Use this search bar to quickly filter and find specific columns by name.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="tour-bulk-action-bar"]',
        content: 'Use this bar to perform bulk actions on multiple columns at once.',
        placement: 'bottom',
      },
      {
        target: '[data-tour="tour-column-list"]',
        content:
          'Here you will see the list of your columns. You can add a description for your column and view the mapped data type and standardized variable.',
        placement: 'right',
      },
      {
        target: '[data-tour="tour-standardized-variables-list"]',
        content:
          'Select a column on the left by clicking anywhere on the card and then select a standardized variable from this list to map them together.',
        placement: 'left',
      },
    ];

    if (firstCollectionVarId) {
      baseSteps.push({
        target: `[data-cy="collection-item-${firstCollectionVarId}"]`,
        content:
          'For collection variables (like Assessment Tool), you can search and select standardized terms (from the designated vocabulary) below.',
        placement: 'left',
      });
    }

    return baseSteps;
  }, [firstCollectionVarId]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, step } = data;

    // Centrally-Scrolled Target Pattern from KI standards
    if (type === EVENTS.STEP_BEFORE && step.target && typeof step.target === 'string') {
      const targetEl = document.querySelector(step.target);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }
    if (
      [STATUS.FINISHED, STATUS.SKIPPED].includes(
        status as typeof STATUS.FINISHED | typeof STATUS.SKIPPED
      )
    ) {
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
