import useViewStore, { getNavigationProps } from './stores/view';
import Landing from './components/Landing';
import Upload from './components/Upload';
import ColumnAnnotation from './components/ColumnAnnotation';
import ValueAnnotation from './components/ValueAnnotation';
import Download from './components/Download';
import NavigationButton from './components/NavigationButton';
import { View } from './utils/types';

function App() {
  const currentView = useViewStore((state) => state.currentView);

  const { backView, nextView, backLabel, nextLabel, className } = getNavigationProps(currentView);

  const renderView = () => {
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

  return (
    <div className="flex flex-col place-content-between">
      <div>{renderView()}</div>
      <div className="">
        {currentView !== View.Landing && currentView !== View.Download && (
          <NavigationButton
            backView={backView}
            nextView={nextView}
            backLabel={backLabel}
            nextLabel={nextLabel}
            className={className}
          />
        )}
      </div>
    </div>
  );
}

export default App;
