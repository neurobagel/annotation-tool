import { Columns, DataDictionary, VariableType, DataType } from '../../internal_types';
import { ConfigFile } from './external_types';

export const mockGitHubResponse = [
  { type: 'file', name: 'README.md' },
  { type: 'dir', name: 'Neurobagel' },
  { type: 'dir', name: 'OtherConfig' },
  { type: 'file', name: 'config.json' },
  { type: 'dir', name: 'TestConfig' },
];

export const mockDataDictionaryWithAnnotations = {
  participant_id: {
    Description: 'A participant ID',
    Annotations: {
      IsAbout: {
        TermURL: 'nb:ParticipantID',
        Label: 'Participant ID',
      },
      VariableType: 'Identifier' as VariableType,
    },
  },
  age: {
    Description: 'Age of the participant',
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Age',
        Label: 'Age',
      },
      Format: {
        TermURL: 'nb:FromFloat',
        Label: 'float',
      },
      VariableType: 'Continuous' as VariableType,
    },
    Units: '',
  },
  sex: {
    Description: 'Sex of the participant',
    Levels: {
      F: {
        Description: 'Female',
        TermURL: 'snomed:248152002',
      },
      M: {
        Description: 'Male',
        TermURL: 'snomed:248153007',
      },
    },
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Sex',
        Label: 'Sex',
      },
      Levels: {
        F: {
          TermURL: 'snomed:248152002',
          Label: 'Female',
        },
        M: {
          TermURL: 'snomed:248153007',
          Label: 'Male',
        },
      },
      MissingValues: ['N/A'],
      VariableType: 'Categorical' as VariableType,
    },
  },
  group_dx: {
    Description: 'Diagnosis of the participant',
    Levels: {
      ADHD: {
        Description: 'Attention deficit hyperactivity disorder',
        TermURL: 'snomed:406506008',
      },
      PD: {
        Description: 'Parkinsons',
        TermURL: 'snomed:870288002',
      },
    },
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Diagnosis',
        Label: 'Diagnosis',
      },
      VariableType: 'Categorical' as VariableType,
      Levels: {
        ADHD: {
          TermURL: 'snomed:406506008',
          Label: 'Attention deficit hyperactivity disorder',
        },
        PD: {
          TermURL: 'snomed:870288002',
          Label: 'Parkinsonism caused by methanol',
        },
      },
    },
  },
  group: {
    Description: 'The group assignment of the participant in a study.',
    Levels: {
      HC: {
        Description: 'Healthy control',
        TermURL: 'ncit:C94342',
      },
    },
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Diagnosis',
        Label: 'Diagnosis',
      },
      VariableType: 'Categorical' as VariableType,
      Levels: {
        HC: {
          TermURL: 'ncit:C94342',
          Label: 'Healthy Control',
        },
      },
      MissingValues: ['Patient', 'N/A'],
    },
  },
  iq: {
    Description: 'iq test score of the participant',
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Assessment',
        Label: 'Assessment Tool',
      },
      IsPartOf: {
        TermURL: 'snomed:273712001',
        Label: 'Previous IQ assessment by pronunciation',
      },
      VariableType: 'Collection' as VariableType,
    },
  },
};

export const mockDataDictionaryWithNoDescription = {
  participant_id: {
    Description: '',
    Annotations: {
      IsAbout: {
        TermURL: 'nb:ParticipantID',
        Label: 'Participant ID',
      },
      VariableType: 'Identifier' as VariableType,
    },
  },
  age: {
    Description: '',
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Age',
        Label: 'Age',
      },
      Format: {
        TermURL: 'nb:FromFloat',
        Label: 'float',
      },
      VariableType: 'Continuous' as VariableType,
    },
    Units: '',
  },
  sex: {
    Description: '',
    Levels: {
      F: {
        Description: 'Female',
        TermURL: 'snomed:248152002',
      },
      M: {
        Description: 'Male',
        TermURL: 'snomed:248153007',
      },
    },
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Sex',
        Label: 'Sex',
      },
      Levels: {
        F: {
          TermURL: 'snomed:248152002',
          Label: 'Female',
        },
        M: {
          TermURL: 'snomed:248153007',
          Label: 'Male',
        },
      },
      MissingValues: ['N/A'],
      VariableType: 'Categorical' as VariableType,
    },
  },
  group_dx: {
    Description: '',
    Levels: {
      ADHD: {
        Description: 'Attention deficit hyperactivity disorder',
        TermURL: 'snomed:406506008',
      },
      PD: {
        Description: 'Parkinsons',
        TermURL: 'snomed:870288002',
      },
    },
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Diagnosis',
        Label: 'Diagnosis',
      },
      VariableType: 'Categorical' as VariableType,
      Levels: {
        ADHD: {
          TermURL: 'snomed:406506008',
          Label: 'Attention deficit hyperactivity disorder',
        },
        PD: {
          TermURL: 'snomed:870288002',
          Label: 'Parkinsonism caused by methanol',
        },
      },
    },
  },
  group: {
    Description: '',
    Levels: {
      HC: {
        Description: 'Healthy control',
        TermURL: 'ncit:C94342',
      },
    },
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Diagnosis',
        Label: 'Diagnosis',
      },
      VariableType: 'Categorical' as VariableType,
      Levels: {
        HC: {
          TermURL: 'ncit:C94342',
          Label: 'Healthy Control',
        },
      },
      MissingValues: ['Patient', 'N/A'],
    },
  },
  iq: {
    Description: '',
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Assessment',
        Label: 'Assessment Tool',
      },
      IsPartOf: {
        TermURL: 'snomed:273712001',
        Label: 'Previous IQ assessment by pronunciation',
      },
      VariableType: 'Collection' as VariableType,
    },
  },
};

export const mockInvalidDataDictionary: DataDictionary = {
  column_without_description: {
    Levels: {
      value: { Description: 'Some value' },
    },
  } as unknown as DataDictionary[string],
  column_with_invalid_levels: {
    Description: 'Column with invalid levels',
    Levels: {} as unknown as { [key: string]: { Description: string; TermURL?: string } },
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Invalid',
        Label: 'Invalid',
      },
      VariableType: 'Categorical' as VariableType,
      Levels: {
        value: {
          Label: 'Invalid',
        } as unknown as { TermURL: string; Label: string },
      },
    },
  },
};

export const mockAnnotatedColumns: Columns = {
  '1': {
    id: '1',
    name: 'participant_id',
    allValues: [],
    description: 'A participant ID',
    dataType: null,
    standardizedVariable: 'nb:ParticipantID',
  },
  '2': {
    id: '2',
    name: 'age',
    allValues: [],
    description: 'Age of the participant',
    dataType: 'Continuous' as DataType,
    standardizedVariable: 'nb:Age',
    units: '',
    format: 'nb:FromFloat',
  },
  '3': {
    id: '3',
    name: 'sex',
    allValues: [],
    description: 'Sex of the participant',
    dataType: 'Categorical' as DataType,
    standardizedVariable: 'nb:Sex',
    levels: {
      F: { description: 'Female', standardizedTerm: 'snomed:248152002' },
      M: { description: 'Male', standardizedTerm: 'snomed:248153007' },
    },
    missingValues: ['N/A'],
  },
  '4': {
    id: '4',
    name: 'group_dx',
    allValues: [],
    description: 'Diagnosis of the participant',
    dataType: 'Categorical' as DataType,
    standardizedVariable: 'nb:Diagnosis',
    levels: {
      ADHD: {
        description: 'Attention deficit hyperactivity disorder',
        standardizedTerm: 'snomed:406506008',
      },
      PD: {
        description: 'Parkinsons',
        standardizedTerm: 'snomed:870288002',
      },
    },
  },
  '5': {
    id: '5',
    name: 'group',
    allValues: [],
    description: 'The group assignment of the participant in a study.',
    dataType: 'Categorical' as DataType,
    standardizedVariable: 'nb:Diagnosis',
    levels: {
      HC: { description: 'Healthy control', standardizedTerm: 'ncit:C94342' },
    },
    missingValues: ['Patient', 'N/A'],
  },
  '6': {
    id: '6',
    name: 'iq',
    allValues: [],
    description: 'iq test score of the participant',
    dataType: null,
    standardizedVariable: 'nb:Assessment',
    isPartOf: 'snomed:273712001',
  },
};

export const mockColumnsWithNoDescription: Columns = {
  '1': {
    ...mockAnnotatedColumns['1'],
    description: '',
  },
  '2': {
    ...mockAnnotatedColumns['2'],
    description: '',
  },
  '3': {
    ...mockAnnotatedColumns['3'],
    description: '',
  },
  '4': {
    ...mockAnnotatedColumns['4'],
    description: '',
  },
  '5': {
    ...mockAnnotatedColumns['5'],
    description: '',
  },
  '6': {
    ...mockAnnotatedColumns['6'],
    description: '',
  },
};

export const mockStandardizedVariables = {
  'nb:ParticipantID': {
    id: 'nb:ParticipantID',
    name: 'Participant ID',
    variable_type: 'Identifier' as VariableType,
    required: true,
    description: 'Unique participant identifier.',
    is_multi_column_measure: false,
    can_have_multiple_columns: false,
    same_as: undefined,
  },
  'nb:SessionID': {
    id: 'nb:SessionID',
    name: 'Session ID',
    variable_type: 'Identifier' as VariableType,
    required: false,
    description: 'Unique session identifier.',
    is_multi_column_measure: false,
    can_have_multiple_columns: false,
    same_as: undefined,
  },
  'nb:Age': {
    id: 'nb:Age',
    name: 'Age',
    variable_type: 'Continuous' as VariableType,
    required: false,
    description: 'The age of the participant.',
    is_multi_column_measure: false,
    can_have_multiple_columns: false,
    same_as: undefined,
  },
  'nb:Sex': {
    id: 'nb:Sex',
    name: 'Sex',
    variable_type: 'Categorical' as VariableType,
    required: false,
    description: 'The sex of the participant.',
    is_multi_column_measure: false,
    can_have_multiple_columns: false,
    same_as: undefined,
  },
  'nb:Diagnosis': {
    id: 'nb:Diagnosis',
    name: 'Diagnosis',
    variable_type: 'Categorical' as VariableType,
    required: false,
    description: 'Participant diagnosis information',
    is_multi_column_measure: false,
    can_have_multiple_columns: true,
    same_as: undefined,
  },
  'nb:Assessment': {
    id: 'nb:Assessment',
    name: 'Assessment Tool',
    variable_type: 'Collection' as VariableType,
    required: false,
    description: 'A cognitive or clinical rating scale, instrument, or assessment tool.',
    is_multi_column_measure: true,
    can_have_multiple_columns: true,
    same_as: undefined,
  },
};

export const mockStandardizedTerms = {
  'snomed:248153007': {
    standardizedVariableId: 'nb:Sex',
    id: 'snomed:248153007',
    label: 'Male',
    isCollection: false,
  },
  'snomed:248152002': {
    standardizedVariableId: 'nb:Sex',
    id: 'snomed:248152002',
    label: 'Female',
    isCollection: false,
  },
  'snomed:32570681000036106': {
    standardizedVariableId: 'nb:Sex',
    id: 'snomed:32570681000036106',
    label: 'Other',
    isCollection: false,
  },
  'snomed:1231282002': {
    standardizedVariableId: 'nb:Diagnosis',
    id: 'snomed:1231282002',
    label: 'Self-limited familial neonatal-infantile epilepsy',
    isCollection: false,
  },
  'snomed:1237571004': {
    standardizedVariableId: 'nb:Diagnosis',
    id: 'snomed:1237571004',
    label: 'Self-limited familial infantile epilepsy',
    isCollection: false,
  },
  'snomed:1259106002': {
    standardizedVariableId: 'nb:Diagnosis',
    id: 'snomed:1259106002',
    label: 'Alexander disease type I',
    isCollection: false,
  },
  'snomed:406506008': {
    standardizedVariableId: 'nb:Diagnosis',
    id: 'snomed:406506008',
    label: 'Attention deficit hyperactivity disorder',
    isCollection: false,
  },
  'snomed:870288002': {
    standardizedVariableId: 'nb:Diagnosis',
    id: 'snomed:870288002',
    label: 'Parkinsonism caused by methanol',
    isCollection: false,
  },
  'snomed:1303696008': {
    standardizedVariableId: 'nb:Assessment',
    id: 'snomed:1303696008',
    label: 'Robson Ten Group Classification System',
    isCollection: false,
  },
  'snomed:1304062007': {
    standardizedVariableId: 'nb:Assessment',
    id: 'snomed:1304062007',
    label: 'Malnutrition Screening Tool',
    isCollection: false,
  },
  'snomed:1332329009': {
    standardizedVariableId: 'nb:Assessment',
    id: 'snomed:1332329009',
    label: 'Interviewer led Chronic Respiratory Questionnaire',
    isCollection: false,
  },
  'snomed:273712001': {
    standardizedVariableId: 'nb:Assessment',
    id: 'snomed:273712001',
    label: 'Previous IQ assessment by pronunciation',
    isCollection: false,
  },
  'ncit:C94342': {
    standardizedVariableId: 'nb:Diagnosis',
    id: 'ncit:C94342',
    label: 'Healthy Control',
    isCollection: false,
  },
};

export const mockStandardizedFormats = {
  'nb:FromFloat': {
    standardizedVariableId: 'nb:Age',
    identifier: 'nb:FromFloat',
    label: 'float',
    examples: ['31.5'],
  },
  'nb:FromEuro': {
    standardizedVariableId: 'nb:Age',
    identifier: 'nb:FromEuro',
    label: 'euro',
    examples: ['31,5'],
  },
  'nb:FromBounded': {
    standardizedVariableId: 'nb:Age',
    identifier: 'nb:FromBounded',
    label: 'bounded',
    examples: ['30+'],
  },
  'nb:FromRange': {
    standardizedVariableId: 'nb:Age',
    identifier: 'nb:FromRange',
    label: 'range',
    examples: ['30-35'],
  },
  'nb:FromISO8601': {
    standardizedVariableId: 'nb:Age',
    identifier: 'nb:FromISO8601',
    label: 'iso8601',
    examples: ['31Y6M'],
  },
};

// Mocked based on mock.tsv
export const mockColumnsAfterDataTableUpload = {
  '0': {
    id: '0',
    name: 'participant_id',
    allValues: [
      'sub-718211',
      'sub-718213',
      'sub-718216',
      'sub-718217',
      'sub-718218',
      'sub-718219',
      'sub-718220',
      'sub-718221',
      'sub-718222',
      'sub-718223',
      'sub-718224',
      'sub-718225',
    ],
  },
  '1': {
    id: '1',
    name: 'age',
    allValues: ['28.4', '24.6', '43.6', '28.4', '72.1', '56.2', '23', '22', '21', '45', '34', '65'],
  },
  '2': {
    id: '2',
    name: 'sex',
    allValues: ['M', 'F', 'M', 'F', 'M', 'M', 'M', 'F', 'M', 'F', 'M', 'N/A'],
  },
  '3': {
    id: '3',
    name: 'group_dx',
    allValues: ['ADHD', 'ADHD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'ADHD', 'PD'],
  },
  '4': {
    id: '4',
    name: 'group',
    allValues: ['HC', 'HC', 'HC', 'HC', 'HC', 'N/A', 'HC', 'HC', 'Patient', 'HC', 'HC', 'HC'],
  },
  '5': {
    id: '5',
    name: 'iq',
    allValues: ['80', '90', '100', '110', '65', '87', '94', '90', '81', '66', '67', '83'],
  },
};

// Expected DataTable output from mockColumnsAfterDataTableUpload
export const mockDataTableFromColumns = {
  participant_id: [
    'sub-718211',
    'sub-718213',
    'sub-718216',
    'sub-718217',
    'sub-718218',
    'sub-718219',
    'sub-718220',
    'sub-718221',
    'sub-718222',
    'sub-718223',
    'sub-718224',
    'sub-718225',
  ],
  age: ['28.4', '24.6', '43.6', '28.4', '72.1', '56.2', '23', '22', '21', '45', '34', '65'],
  sex: ['M', 'F', 'M', 'F', 'M', 'M', 'M', 'F', 'M', 'F', 'M', 'N/A'],
  group_dx: ['ADHD', 'ADHD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'ADHD', 'PD'],
  group: ['HC', 'HC', 'HC', 'HC', 'HC', 'N/A', 'HC', 'HC', 'Patient', 'HC', 'HC', 'HC'],
  iq: ['80', '90', '100', '110', '65', '87', '94', '90', '81', '66', '67', '83'],
};

export const mockConfigFile: ConfigFile = {
  vocabulary_name: 'Neurobagel Phenotypic Variables',
  namespace_prefix: 'nb',
  namespace_url: 'http://neurobagel.org/vocab/',
  version: '1.0.0',
  standardized_variables: [
    {
      name: 'Participant ID',
      id: 'ParticipantID',
      variable_type: 'Identifier' as VariableType,
      terms_file: undefined,
      formats: undefined,
      required: true,
      description: 'Unique participant identifier.',
      is_multi_column_measure: false,
      can_have_multiple_columns: false,
      same_as: undefined,
    },
    {
      name: 'Session ID',
      id: 'SessionID',
      variable_type: 'Identifier' as VariableType,
      terms_file: undefined,
      formats: undefined,
      required: false,
      description: 'Unique session identifier.',
      is_multi_column_measure: false,
      can_have_multiple_columns: false,
      same_as: undefined,
    },
    {
      name: 'Age',
      id: 'Age',
      variable_type: 'Continuous' as VariableType,
      terms_file: undefined,
      formats: [
        {
          id: 'FromFloat',
          name: 'float',
          examples: ['31.5'],
        },
        {
          id: 'FromEuro',
          name: 'euro',
          examples: ['31,5'],
        },
        {
          id: 'FromBounded',
          name: 'bounded',
          examples: ['30+'],
        },
        {
          id: 'FromRange',
          name: 'range',
          examples: ['30-35'],
        },
        {
          id: 'FromISO8601',
          name: 'iso8601',
          examples: ['31Y6M'],
        },
      ],
      required: false,
      description: 'The age of the participant.',
      is_multi_column_measure: false,
      can_have_multiple_columns: false,
      same_as: undefined,
    },
    {
      name: 'Sex',
      id: 'Sex',
      variable_type: 'Categorical' as VariableType,
      terms_file: 'sex.json',
      formats: undefined,
      required: false,
      description: 'The sex of the participant.',
      is_multi_column_measure: false,
      can_have_multiple_columns: false,
      same_as: undefined,
    },
    {
      name: 'Diagnosis',
      id: 'Diagnosis',
      variable_type: 'Categorical' as VariableType,
      terms_file: 'diagnosis.json',
      formats: undefined,
      required: false,
      description: 'Participant diagnosis information',
      is_multi_column_measure: false,
      can_have_multiple_columns: true,
      same_as: undefined,
    },
    {
      name: 'Assessment Tool',
      id: 'Assessment',
      variable_type: 'Collection' as VariableType,
      terms_file: 'assessment.json',
      formats: undefined,
      required: false,
      description: 'A cognitive or clinical rating scale, instrument, or assessment tool.',
      is_multi_column_measure: true,
      can_have_multiple_columns: true,
      same_as: undefined,
    },
  ],
};

export const mockTermsData = {
  'sex.json': [
    {
      namespace_prefix: 'snomed',
      namespace_url: 'http://snomed.info/sct/',
      vocabulary_name: 'SNOMED CT',
      version: '1.0.0',
      terms: [
        {
          id: '248153007',
          name: 'Male',
        },
        {
          id: '248152002',
          name: 'Female',
        },
        {
          id: '32570681000036106',
          name: 'Other',
        },
      ],
    },
  ],
  'diagnosis.json': [
    {
      namespace_prefix: 'snomed',
      namespace_url: 'http://snomed.info/sct/',
      vocabulary_name: 'SNOMED CT',
      version: '1.0.0',
      terms: [
        {
          id: '1231282002',
          name: 'Self-limited familial neonatal-infantile epilepsy',
        },
        {
          id: '1237571004',
          name: 'Self-limited familial infantile epilepsy',
        },
        {
          id: '1259106002',
          name: 'Alexander disease type I',
        },
        {
          id: '406506008',
          name: 'Attention deficit hyperactivity disorder',
        },
        {
          id: '870288002',
          name: 'Parkinsonism caused by methanol',
        },
      ],
    },
    {
      namespace_prefix: 'ncit',
      namespace_url: 'http://ncithesaurus.nci.nih.gov/',
      vocabulary_name: 'NCIT',
      version: '1.0.0',
      terms: [
        {
          id: 'C94342',
          name: 'Healthy Control',
        },
      ],
    },
  ],
  'assessment.json': [
    {
      namespace_prefix: 'snomed',
      namespace_url: 'http://snomed.info/sct/',
      vocabulary_name: 'SNOMED CT',
      version: '1.0.0',
      terms: [
        {
          id: '1303696008',
          name: 'Robson Ten Group Classification System',
        },
        {
          id: '1304062007',
          name: 'Malnutrition Screening Tool',
        },
        {
          id: '1332329009',
          name: 'Interviewer led Chronic Respiratory Questionnaire',
        },
        {
          id: '273712001',
          name: 'Previous IQ assessment by pronunciation',
        },
      ],
    },
  ],
};

export const mockAvailableConfigOptions = ['Neurobagel', 'OtherConfig', 'TestConfig'];
