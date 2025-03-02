import { Typography } from '@mui/material';
import NavigationButton from './NavigationButton';
import logo from '../assets/logo.svg';
import landingEmoji from '../assets/landing-emoji.png';

function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
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
        nextView="upload"
        nextLabel="Get Started"
        className="mt-6"
      />
    </div>
  );
}

export default Landing;