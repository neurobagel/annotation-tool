import NavigationButton from './NavigationButton';

function ColumnAnnotation() {
  return (
    <div className="flex flex-col items-center">
      <h1>Column Annotation</h1>
      <div className="flex space-x-4">
        <NavigationButton label="Back - Upload" viewToNavigateTo="upload" />
        <NavigationButton label="Next - Value Annotation" viewToNavigateTo="valueAnnotation" />
      </div>
    </div>
  );
}

export default ColumnAnnotation;
