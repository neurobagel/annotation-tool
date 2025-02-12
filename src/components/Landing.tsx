import NavigationButton from './NavigationButton';

function Landing() {
  return (
    <div className="flex flex-col items-center">
      <h1>Welcome</h1>
      <NavigationButton label="Start - Upload" viewToNavigateTo="upload" />
    </div>
  );
}

export default Landing;
