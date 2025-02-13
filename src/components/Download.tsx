import NavigationButton from './NavigationButton';

function Download() {
  return (
    <div className="flex flex-col items-center">
      <h1>Download</h1>
      <NavigationButton label="Back - Value Annotation" viewToNavigateTo="valueAnnotation" />
    </div>
  );
}

export default Download;
