import NavigationButton from './NavigationButton';

function Download() {
  return (
    <div className="flex flex-col items-center">
      <h1>Download</h1>
      <NavigationButton
        backView="valueAnnotation"
        nextView={undefined}
        backLabel='Back to Value Annotations'
      />
    </div>
  );
}

export default Download;
