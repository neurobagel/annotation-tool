import { List, ListItem, ListItemText } from '@mui/material';
import { useEffect } from 'react';
import useDataStore from '../stores/data';
import ConfigCard from './ConfigCard';
import DataDictionaryPreview from './DataDictionaryPreview';
import DataTablePreview from './DataTablePreview';
import Instruction from './Instruction';
import UploadCard from './UploadCard';

interface UploadProps {
  disableConfig: boolean;
}

function Upload({ disableConfig }: UploadProps) {
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

  const handleFileUpload = (file: File) => {
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
          <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText
                primary={
                  <>Here you load the tabular data, that you want to annotate, into the app.</>
                }
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText
                primary={
                  <>
                    <strong>[required]</strong> Upload a tabular phenotypic <code>.tsv</code> file.
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText
                primary={
                  <>
                    <strong>[optional]</strong> Upload a data dictionary for your tabular file to
                    give you more context during the annotation. This could be a BIDS data
                    dictionary or a data dictionary you have generated in a previous session with
                    the Neurobagel annotator.
                  </>
                }
              />
            </ListItem>
            <ListItem sx={{ display: 'list-item' }}>
              <ListItemText
                primary={
                  <>
                    When you have uploaded your files, you can look at a preview to check that all
                    looks good. And then you can navigate to the next step.
                  </>
                }
              />
            </ListItem>
          </List>
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
        onFileUpload={handleFileUpload}
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
