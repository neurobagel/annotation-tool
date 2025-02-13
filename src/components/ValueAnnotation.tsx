import NavigationButton from './NavigationButton';

function ValueAnnotation() {
  return (
    <div className="flex flex-col items-center">
      <h1>Value Annotation</h1>
      <div className="flex space-x-4">
        <NavigationButton label="Back - Column Annotation" viewToNavigateTo="columnAnnotation" />
        <NavigationButton label="Next - Download" viewToNavigateTo="download" />
      </div>
    </div>
  );
}

export default ValueAnnotation;
