import useViewStore from './stores/view';
import Landing from './components/Landing';
import Upload from './components/Upload';
import ColumnAnnotation from './components/ColumnAnnotation';
import ValueAnnotation from './components/ValueAnnotation';
import Download from './components/Download';

function App() {
  const currentView = useViewStore((state) => state.currentView);

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

  return <div>{renderView()}</div>;
}

export default App;
