import NavigationButton from './NavigationButton';

function Upload() {
  return (
    <div className="flex flex-col items-center">
      <h1>Upload</h1>
      <div className="flex space-x-4">
        <NavigationButton label="Back - Welcome" viewToNavigateTo="landing" />
        <NavigationButton label="Next - Column Annotation" viewToNavigateTo="columnAnnotation" />
      </div>
    </div>
  );
}

export default Upload;
