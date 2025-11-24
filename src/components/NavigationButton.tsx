import { Button } from '@mui/material';
import { View } from '../../internal_types';
import useViewStore from '../stores/view';

const defaultProps = {
  backLabel: 'Back',
  nextLabel: 'Next',
  disableBack: false,
  disableNext: false,
  styleClassName: '',
};

function NavigationButton({
  backView,
  nextView,
  backLabel,
  nextLabel,
  disableBack,
  disableNext,
  styleClassName,
}: {
  backView: View | undefined;
  nextView: View | undefined;
  backLabel?: string;
  nextLabel?: string;
  disableBack?: boolean;
  disableNext?: boolean;
  styleClassName?: string;
}) {
  const setCurrentView = useViewStore((state) => state.setCurrentView);

  const handleBack = () => {
    if (backView) {
      setCurrentView(backView);
    }
  };

  const handleNext = () => {
    if (nextView) {
      setCurrentView(nextView);
    }
  };

  return (
    <div className={`flex flex-row justify-between ${styleClassName}`}>
      {backView && (
        <Button
          data-cy="back-button"
          disabled={disableBack}
          variant="contained"
          onClick={handleBack}
        >
          {backLabel}
        </Button>
      )}
      {nextView && (
        <Button
          data-cy="next-button"
          disabled={disableNext}
          variant="contained"
          onClick={handleNext}
        >
          {nextLabel}
        </Button>
      )}
    </div>
  );
}

NavigationButton.defaultProps = defaultProps;

export default NavigationButton;
