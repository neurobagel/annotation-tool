import NavigationButton from './NavigationButton';
import { View } from '../utils/types';

function Download() {
  return (
    <div className="flex flex-col items-center">
      <h1>Download</h1>
      <NavigationButton
        backView={View.ValueAnnotation}
        nextView={undefined}
        backLabel="Back to Value Annotations"
      />
    </div>
  );
}

export default Download;
