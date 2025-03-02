import { Button } from '@mui/material';
import useViewStore from '../stores/view';

const defaultProps = {
  backLabel: 'Back',
  nextLabel: 'Next',
  className: '',
};

function NavigationButton({
  backView,
  nextView,
  backLabel,
  nextLabel,
  className,
}: {
  backView: string | undefined;
  nextView: string | undefined;
  backLabel?: string;
  nextLabel?: string;
  className?: string;
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
    <div className={`flex flex-row justify-between ${className}`}>
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