import { Button } from '@mui/material';
import useStore from '../stores/store';

function NavigationButton({
  label,
  viewToNavigateTo,
}: {
  label: string;
  viewToNavigateTo: string;
}) {
  const setCurrentView = useStore((state) => state.setCurrentView);

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
