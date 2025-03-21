import ColumnAnnotation from './components/ColumnAnnotation';
import Download from './components/Download';
import Landing from './components/Landing';
import NavStepper from './components/NavStepper';
import NavigationButton from './components/NavigationButton';
import Upload from './components/Upload';
import ValueAnnotation from './components/ValueAnnotation';
import useViewStore, { getNavigationProps } from './stores/view';
import { View } from './utils/types';

function App() {
  const currentView = useViewStore((state) => state.currentView);

  const { backView, nextView, backLabel, nextLabel, className } = getNavigationProps(currentView);

  const determineView = () => {
    switch (currentView) {
      case View.Landing:
        return <Landing />;
      case View.Upload:
        return <Upload />;
      case View.ColumnAnnotation:
        return <ColumnAnnotation />;
      case View.ValueAnnotation:
        return <ValueAnnotation />;
      case View.Download:
        return <Download />;
      default:
        return <Landing />;
    }
  };

  // Alias for the better readability
  const content = determineView();

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {currentView !== View.Landing && <NavStepper currentView={currentView} />}

      {content}

      {currentView !== View.Landing && currentView !== View.Download && (
        <div className="mt-auto">
          <NavigationButton
            backView={backView}
            nextView={nextView}
            backLabel={backLabel}
            nextLabel={nextLabel}
            styleClassName={className}
          />
        </div>
      )}
    </div>
  );
}

export default App;
