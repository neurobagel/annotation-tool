import useViewStore from './stores/view';
import Landing from './components/Landing';
import Upload from './components/Upload';
import ColumnAnnotation from './components/ColumnAnnotation';
import ValueAnnotation from './components/ValueAnnotation';
import Download from './components/Download';
import NavigationButton from './components/NavigationButton';

function App() {
  const currentView = useViewStore((state) => state.currentView);

  const getNavigationViews = (currentView: string) => {
    switch (currentView) {
      case 'landing':
        return { backView: undefined, nextView: undefined }; // Navigation is handled inside Landing
      case 'upload':
        return { backView: 'landing', nextView: 'columnAnnotation' };
      case 'columnAnnotation':
        return { backView: 'upload', nextView: 'valueAnnotation' };
      case 'valueAnnotation':
        return { backView: 'columnAnnotation', nextView: 'download' };
      case 'download':
        return { backView: 'valueAnnotation', nextView: undefined };
      default:
        return { backView: undefined, nextView: undefined };
    }
  };

  const { backView, nextView } = getNavigationViews(currentView);

  const getNavigationConfig = (currentView: string) => {
    switch (currentView) {
      case 'upload':
        return {
          backLabel: 'Back to Landing',
          nextLabel: 'Next: Column Annotation',
          className: 'p-4',
        };
      case 'columnAnnotation':
        return {
          backLabel: 'Back to Upload',
          nextLabel: 'Next: Value Annotation',
          className: 'p-4',
        };
      case 'valueAnnotation':
        return {
          backLabel: 'Back to Column Annotation',
          nextLabel: 'Next: Download',
          className: 'p-4',
        };
      default:
        return {
          backLabel: 'Back',
          nextLabel: 'Next',
          className: '',
        };
    }
  };

  const { backLabel, nextLabel, className } = getNavigationConfig(currentView);

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <Landing />;
      case 'upload':
        return <Upload />;
      case 'columnAnnotation':
        return <ColumnAnnotation />;
      case 'valueAnnotation':
        return <ValueAnnotation />;
      case 'download':
        return <Download />;
      default:
        return <Landing />;
    }
  };

  return (
    <div className="flex flex-col place-content-between">
      <div>{renderView()}</div>
      <div className=''>
      {(currentView !== 'landing' && currentView !== 'download' ) && (
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