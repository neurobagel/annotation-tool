import UploadCard from './UploadCard';
import DataTablePreview from './DataTablePreview';
import useDataStore from '../stores/data';
import NavigationButton from './NavigationButton';

function Upload() {
  const processFile = useDataStore((state) => state.processFile);
  const dataTable = useDataStore((state) => state.dataTable);
  const columns = useDataStore((state) => state.columns);
  const uploadedDataTableFileName = useDataStore((state) => state.uploadedDataTableFileName);
  const setUploadedDataTableFileName = useDataStore((state) => state.setUploadedDataTableFileName);

  const handleFileUpload = (file: File) => {
    setUploadedDataTableFileName(file.name);
    processFile(file);
  };

  return (
    <div className="flex flex-col items-center">
      <h1>Upload</h1>
      <UploadCard
        title="Data Table"
        allowedFileType=".tsv"
        uploadedFileName={uploadedDataTableFileName}
        onFileUpload={handleFileUpload}
        previewComponent={<DataTablePreview dataTable={dataTable} columns={columns} />}
      />
      <div className="flex space-x-4">
        <NavigationButton label="Back - Welcome" viewToNavigateTo="landing" />
        <NavigationButton label="Next - Column Annotation" viewToNavigateTo="columnAnnotation" />
      </div>
    </div>
  );
}

export default Upload;
