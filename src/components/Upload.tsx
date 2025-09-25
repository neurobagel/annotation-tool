import { useEffect } from 'react';
import useDataStore from '../stores/data';
import { UploadInstructions } from '../utils/instructions';
import ConfigCard from './ConfigCard';
import DataDictionaryPreview from './DataDictionaryPreview';
import DataTablePreview from './DataTablePreview';
import Instruction from './Instruction';
import UploadCard from './UploadCard';

interface UploadProps {
  disableConfig: boolean;
}

function Upload({ disableConfig }: UploadProps) {
  const reset = useDataStore((state) => state.reset);
  const processDataTableFile = useDataStore((state) => state.processDataTableFile);
  const processDataDictionaryFile = useDataStore((state) => state.processDataDictionaryFile);
  const dataTable = useDataStore((state) => state.dataTable);
  const columns = useDataStore((state) => state.columns);
  const dataDictionary = useDataStore((state) => state.uploadedDataDictionary);
  const uploadedDataTableFileName = useDataStore((state) => state.uploadedDataTableFileName);
  const loadConfigOptions = useDataStore((state) => state.loadConfigOptions);
  const configOptions = useDataStore((state) => state.configOptions);
  const selectedConfig = useDataStore((state) => state.selectedConfig);
  const setSelectedConfig = useDataStore((state) => state.setSelectedConfig);
  const setUploadedDataTableFileName = useDataStore((state) => state.setUploadedDataTableFileName);
  const setUploadedDataDictionaryFileName = useDataStore(
    (state) => state.setUploadedDataDictionaryFileName
  );
  const uploadedDataDictionaryFileName = useDataStore(
    (state) => state.uploadedDataDictionaryFileName
  );
  const isConfigLoading = useDataStore((state) => state.isConfigLoading);

  const isDataTableEmpty = Object.keys(dataTable).length === 0;

  const handleDataTableFileUpload = (file: File) => {
    reset();
    setUploadedDataTableFileName(file.name);
    processDataTableFile(file);
  };

  const handleDataDictionaryFileUpload = (file: File) => {
    processDataDictionaryFile(file);
    setUploadedDataDictionaryFileName(file.name);
  };

  useEffect(() => {
    const loadConfigs = async () => {
      await loadConfigOptions();
    };
    loadConfigs();
    setSelectedConfig('Neurobagel');
  }, [loadConfigOptions, setSelectedConfig]);

  return (
    <div className="flex flex-col items-center gap-8" data-config-loading={isConfigLoading}>
      <div className="w-full max-w-[1024px]">
        <Instruction title="Upload" className="mb-2">
          <UploadInstructions />
        </Instruction>
      </div>
      {disableConfig ? null : (
        <ConfigCard
          title="Configuration"
          options={configOptions}
          value={selectedConfig}
          isLoading={isConfigLoading}
          onChange={(value) => setSelectedConfig(value)}
        />
      )}
      <UploadCard
        id="datatable"
        title="Data Table"
        FileUploaderDisplayText="Upload your tabular phenotypic .tsv file (required)"
        allowedFileType=".tsv"
        uploadedFileName={uploadedDataTableFileName}
        onFileUpload={handleDataTableFileUpload}
        previewComponent={<DataTablePreview dataTable={dataTable} columns={columns} />}
        diableFileUploader={isConfigLoading}
      />
      <UploadCard
        id="datadictionary"
        title="Data Dictionary"
        FileUploaderDisplayText="Upload your data dictionary .json file (optional)"
        allowedFileType=".json"
        uploadedFileName={uploadedDataDictionaryFileName}
        onFileUpload={handleDataDictionaryFileUpload}
        previewComponent={<DataDictionaryPreview dataDictionary={dataDictionary} />}
        diableFileUploader={isDataTableEmpty || isConfigLoading}
        FileUploaderToolTipContent={isDataTableEmpty ? 'Please upload a data table first' : ''}
      />
    </div>
  );
}

export default Upload;
