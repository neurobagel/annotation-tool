import { useEffect } from 'react';
import ColumnAnnotation from './components/ColumnAnnotation';
import Download from './components/Download';
import Landing from './components/Landing';
import MultiColumnMeasures from './components/MultiColumnMeasures';
import NavStepper from './components/NavStepper';
import NavigationButton from './components/NavigationButton';
import Upload from './components/Upload';
import ValueAnnotation from './components/ValueAnnotation';
import useDataStore from './stores/data';
import useViewStore, { getNavigationProps } from './stores/view';
import { View } from './utils/types';

function App() {
  const currentView = useViewStore((state) => state.currentView);
  const setCurrentView = useViewStore((state) => state.setCurrentView);
  const hasMeasures = useDataStore((state) => state.hasMultiColumnMeasures());

  const { backView, nextView, backLabel, nextLabel, className } = getNavigationProps(currentView);

  useEffect(() => {
    if (currentView === View.MultiColumnMeasures && !hasMeasures) {
      setCurrentView(View.ColumnAnnotation);
    }
  }, [currentView, hasMeasures, setCurrentView]);

  const determineView = () => {
    switch (currentView) {
      case View.Landing:
        return <Landing />;
      case View.Upload:
        return <Upload />;
      case View.ColumnAnnotation:
        return <ColumnAnnotation />;
      case View.MultiColumnMeasures:
        return <MultiColumnMeasures />;
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
