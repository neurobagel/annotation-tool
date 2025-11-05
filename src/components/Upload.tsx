import { useEffect } from 'react';
import { useDataTable } from '../hooks/useDataTable';
import {
  useConfig,
  useFreshDataActions,
  useIsConfigLoading,
  useUploadedDataTableFileName,
  useConfigOptions,
  useUploadedDataDictionary,
} from '../stores/FreshNewStore';
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
  const dataTable = useDataTable();
  const { fileName, dataDictionary } = useUploadedDataDictionary();
  const uploadedDataTableFileName = useUploadedDataTableFileName();
  const {
    appFetchesConfigOptions,
    userSelectsConfig,
    userUploadsDataTableFile,
    reset,
    userUploadsDataDictionaryFile,
  } = useFreshDataActions();
  const configOptions = useConfigOptions();
  const selectedConfig = useConfig();
  const isConfigLoading = useIsConfigLoading();

  const isDataTableEmpty = Object.keys(dataTable).length === 0;

  const handleDataTableFileUpload = (file: File) => {
    reset();
    userUploadsDataTableFile(file);
  };

  const handleDataDictionaryFileUpload = (file: File) => {
    userUploadsDataDictionaryFile(file);
  };

  useEffect(() => {
    const loadConfigs = async () => {
      await appFetchesConfigOptions();
    };
    loadConfigs();
    userSelectsConfig('Neurobagel');
  }, [appFetchesConfigOptions, userSelectsConfig]);

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
          onChange={(value) => userSelectsConfig(value)}
        />
      )}
      <UploadCard
        id="datatable"
        title="Data Table"
        FileUploaderDisplayText="Upload your tabular phenotypic .tsv file (required)"
        allowedFileType=".tsv"
        uploadedFileName={uploadedDataTableFileName}
        onFileUpload={handleDataTableFileUpload}
        previewComponent={<DataTablePreview dataTable={dataTable} />}
        diableFileUploader={isConfigLoading}
      />
      <UploadCard
        id="datadictionary"
        title="Data Dictionary"
        FileUploaderDisplayText="Upload your data dictionary .json file (optional)"
        allowedFileType=".json"
        uploadedFileName={fileName}
        onFileUpload={handleDataDictionaryFileUpload}
        previewComponent={<DataDictionaryPreview dataDictionary={dataDictionary} />}
        diableFileUploader={isDataTableEmpty || isConfigLoading}
        FileUploaderToolTipContent={isDataTableEmpty ? 'Please upload a data table first' : ''}
      />
    </div>
  );
}

export default Upload;
