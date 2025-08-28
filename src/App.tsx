import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import AppTitle from './components/AppTitle';
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
import { View } from './utils/internal_types';

function App() {
  const currentView = useViewStore((state) => state.currentView);
  const setCurrentView = useViewStore((state) => state.setCurrentView);
  const hasMultiColumnMeasures = useDataStore((state) => state.hasMultiColumnMeasures());

  const theme = useTheme();
  const appBarHeight = theme.mixins.toolbar.minHeight || 64;

  const { backView, nextView, backLabel, nextLabel, className } = getNavigationProps(
    currentView,
    hasMultiColumnMeasures
  );

  useEffect(() => {
    if (currentView === View.MultiColumnMeasures && !hasMultiColumnMeasures) {
      setCurrentView(View.ColumnAnnotation);
    }
  }, [currentView, hasMultiColumnMeasures, setCurrentView]);

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
    <div
      className="flex flex-col overflow-x-hidden"
      style={{
        minHeight: `calc(100vh - ${appBarHeight}px)`,
        marginTop: appBarHeight,
      }}
    >
      {currentView !== View.Landing && (
        <>
          <AppTitle
            title="Neurobagel Annotation Tool"
            githubUrl="https://github.com/neurobagel/annotation-tool"
            docsUrl="https://neurobagel.org/user_guide/annotation_tool/"
          />
          <NavStepper currentView={currentView} />
        </>
      )}

      {content}

      {currentView !== View.Landing && (
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
