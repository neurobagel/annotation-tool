import UploadCard from './UploadCard';
import DataTablePreview from './DataTablePreview';
import useDataStore from '../stores/data';
import NavigationButton from './NavigationButton';
import DataDictionaryPreview from './DataDictionaryPreview';

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

  const mockJson = {
    participant_id: {
      Description: 'A participant ID',
      Annotations: {
        IsAbout: {
          TermURL: 'nb:ParticipantID',
          Label: 'Subject Unique Identifier',
        },
        Identifies: 'participant',
      },
    },
    session_id: {
      Description: 'A session ID',
    },
    pheno_age: {
      Description: 'Age of the participant',
      Annotations: {
        IsAbout: {
          TermURL: 'nb:Age',
          Label: 'Age',
        },
        Transformation: {
          TermURL: 'nb:FromEuro',
          Label: 'european decimal value',
        },
        MissingValues: ['NA'],
      },
    },
    pheno_sex: {
      Description: 'Sex variable',
      Levels: {
        M: 'Male',
        F: 'Female',
      },
      Annotations: {
        IsAbout: {
          TermURL: 'nb:Sex',
          Label: 'Sex',
        },
        Levels: {
          M: {
            TermURL: 'snomed:248153007',
            Label: 'Male',
          },
          F: {
            TermURL: 'snomed:248152002',
            Label: 'Female',
          },
        },
        MissingValues: ['missing'],
      },
    },
    pheno_group: {
      Description: 'Group variable',
      Levels: {
        PAT: 'Patient',
        CTRL: 'Control subject',
      },
      Annotations: {
        IsAbout: {
          TermURL: 'nb:Diagnosis',
          Label: 'Diagnosis',
        },
        Levels: {
          PAT: {
            TermURL: 'snomed:406506008',
            Label: 'Attention deficit hyperactivity disorder',
          },
          CTRL: {
            TermURL: 'ncit:C94342',
            Label: 'Healthy Control',
          },
        },
        MissingValues: ['NA'],
      },
    },
    tool1_item1: {
      Description: 'item 1 scores for tool1',
      Annotations: {
        IsAbout: {
          TermURL: 'nb:Assessment',
          Label: 'Assessment tool',
        },
        IsPartOf: {
          TermURL: 'cogatlas:trm_57964b8a66aed',
          Label: 'Montreal Cognitive Assessment',
        },
        MissingValues: ['missing'],
      },
    },
    tool1_item2: {
      Description: 'item 2 scores for tool1',
      Annotations: {
        IsAbout: {
          TermURL: 'nb:Assessment',
          Label: 'Assessment tool',
        },
        IsPartOf: {
          TermURL: 'cogatlas:trm_57964b8a66aed',
          Label: 'Montreal Cognitive Assessment',
        },
        MissingValues: ['missing'],
      },
    },
    tool2_item1: {
      Description: 'item 1 scores for tool2',
      Annotations: {
        IsAbout: {
          TermURL: 'nb:Assessment',
          Label: 'Assessment tool',
        },
        IsPartOf: {
          TermURL: 'cogatlas:tsk_4a57abb949ece',
          Label: "Unified Parkinson's Disease Rating Scale",
        },
        MissingValues: ['not completed'],
      },
    },
  };

  return (
    <div className="flex flex-col items-center">
      <h1>Upload</h1>
      <UploadCard
        title="Data Table"
        FileUploaderDisplayText="Upload your tabular phenotypic .tsv file (required)"
        allowedFileType=".tsv"
        uploadedFileName={uploadedDataTableFileName}
        onFileUpload={handleFileUpload}
        previewComponent={<DataTablePreview dataTable={dataTable} columns={columns} />}
      />
      <UploadCard
        title="Data Dictionary"
        FileUploaderDisplayText="Upload your data dictionary .json file (optional)"
        allowedFileType=".json"
        uploadedFileName="mock.json"
        onFileUpload={handleFileUpload}
        previewComponent={<DataDictionaryPreview dataDictionary={mockJson} />}
      />
      <div className="flex space-x-4">
        <NavigationButton label="Back - Welcome" viewToNavigateTo="landing" />
        <NavigationButton label="Next - Column Annotation" viewToNavigateTo="columnAnnotation" />
      </div>
    </div>
  );
}

export default Upload;
