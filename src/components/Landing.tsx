import { Typography } from '@mui/material';
import landingEmoji from '../assets/landing-emoji.png';
import logo from '../assets/logo.svg';
import { View } from '../utils/types';
import NavigationButton from './NavigationButton';

function Landing() {
  return (
    <div className="m-auto flex flex-col items-center">
      <img src={logo} alt="Neurobagel Logo" className="mb-6 h-36 w-36 animate-spin-slow" />
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4">
          <img src={landingEmoji} alt="Landing emoji" className="mb-6 h-24 w-24" />
          <Typography variant="h3" component="h1" className="font-bold">
            Welcome to the Neurobagel Annotation Tool
          </Typography>
        </div>

        <Typography variant="subtitle1" className="text-gray-600">
          This tool allows you to create a machine-readable BIDS data dictionary in .json format for
          a tabular phenotypic file in .tsv format.
        </Typography>
      </div>
      <NavigationButton
        backView={undefined}
        nextView={View.Upload}
        nextLabel="Get Started"
        styleClassName="mt-6"
      />
    </div>
  );
}

export default Landing;
