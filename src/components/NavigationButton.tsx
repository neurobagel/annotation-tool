import { Button } from '@mui/material';
import useViewStore from '../stores/view';
import { View } from '../utils/types';

const defaultProps = {
  backLabel: 'Back',
  nextLabel: 'Next',
  styleClassName: '',
};

function NavigationButton({
  backView,
  nextView,
  backLabel,
  nextLabel,
  styleClassName,
}: {
  backView: View | undefined;
  nextView: View | undefined;
  backLabel?: string;
  nextLabel?: string;
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
        <Button data-cy="back-button" variant="contained" onClick={handleBack}>
          {backLabel}
        </Button>
      )}
      {nextView && (
        <Button data-cy="next-button" variant="contained" onClick={handleNext}>
          {nextLabel}
        </Button>
      )}
    </div>
  );
}

NavigationButton.defaultProps = defaultProps;

export default NavigationButton;
