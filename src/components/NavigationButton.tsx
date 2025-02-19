import { Button } from '@mui/material';
import useViewStore from '../stores/view';

function NavigationButton({
  label,
  viewToNavigateTo,
}: {
  label: string;
  viewToNavigateTo: string;
}) {
  const setCurrentView = useViewStore((state) => state.setCurrentView);

  const handleClick = () => {
    setCurrentView(viewToNavigateTo);
  };

  return (
    <Button data-cy={`${label.toLowerCase()}-button`} variant="contained" onClick={handleClick}>
      {label}
    </Button>
  );
}

export default NavigationButton;
