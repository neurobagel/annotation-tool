import useDataStore from '../stores/data';
import DataDictionaryPreview from './DataDictionaryPreview';
import DataTablePreview from './DataTablePreview';
import UploadCard from './UploadCard';

function Upload() {
  const processDataTableFile = useDataStore((state) => state.processDataTableFile);
  const processDataDictionaryFile = useDataStore((state) => state.processDataDictionaryFile);
  const dataTable = useDataStore((state) => state.dataTable);
  const columns = useDataStore((state) => state.columns);
  const dataDictionary = useDataStore((state) => state.uploadedDataDictionary);
  const uploadedDataTableFileName = useDataStore((state) => state.uploadedDataTableFileName);
  const setUploadedDataTableFileName = useDataStore((state) => state.setUploadedDataTableFileName);
  const setUploadedDataDictionaryFileName = useDataStore(
    (state) => state.setUploadedDataDictionaryFileName
  );
  const uploadedDataDictionaryFileName = useDataStore(
    (state) => state.uploadedDataDictionaryFileName
  );

  const isDataTableEmpty = Object.keys(dataTable).length === 0;

  const handleFileUpload = (file: File) => {
    setUploadedDataTableFileName(file.name);
    processDataTableFile(file);
  };

  const handleDataDictionaryFileUpload = (file: File) => {
    processDataDictionaryFile(file);
    setUploadedDataDictionaryFileName(file.name);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <UploadCard
        id="datatable"
        title="Data Table"
        FileUploaderDisplayText="Upload your tabular phenotypic .tsv file (required)"
        allowedFileType=".tsv"
        uploadedFileName={uploadedDataTableFileName}
        onFileUpload={handleFileUpload}
        previewComponent={<DataTablePreview dataTable={dataTable} columns={columns} />}
      />
      <UploadCard
        id="datadictionary"
        title="Data Dictionary"
        FileUploaderDisplayText="Upload your data dictionary .json file (optional)"
        allowedFileType=".json"
        uploadedFileName={uploadedDataDictionaryFileName}
        onFileUpload={handleDataDictionaryFileUpload}
        previewComponent={<DataDictionaryPreview dataDictionary={dataDictionary} />}
        diableFileUploader={isDataTableEmpty}
        FileUploaderToolTipContent={isDataTableEmpty ? 'Please upload a data table first' : ''}
      />
    </div>
  );
}

export default Upload;
