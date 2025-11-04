// TODO: Remove duplicate mocks once store refactoring is done
import { VariableType as FreshVariableType } from 'datamodel';
import { ConfigFile, FreshConfigFile } from '~/utils/external_types';
import { Config, VariableType, Columns } from './internal_types';

export const mockDataTable = {
  1: [
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
  2: ['28.4', '24.6', '43.6', '28.4', '72.1', '56.2', '23', '22', '21', '45', '34', '65'],
  3: ['M', 'F', 'M', 'F', 'M', 'M', 'M', 'F', 'M', 'F', 'M', 'N/A'],
  4: ['ADHD', 'ADHD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'ADHD', 'PD'],
  5: ['HC', 'HC', 'HC', 'HC', 'HC', 'N/A', 'HC', 'HC', 'Patient', 'HC', 'HC', 'HC'],
  6: ['80', '90', '100', '110', '65', '87', '94', '90', '81', '66', '67', '83'],
};

export const mockDataTableWithEmptyLine = {
  1: [
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
  2: ['28.4', '24.6', '43.6', '28.4', '72.1', '56.2', '23', '22', '21', '45', '34', '65'],
  3: ['M', 'F', 'M', 'F', 'M', 'M', 'M', 'F', 'M', 'F', 'M', 'N/A'],
  4: ['ADHD', 'ADHD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'ADHD', 'PD'],
  5: ['80', '90', '100', '110', '65', '87', '94', '90', '81', '66', '67', '83'],
};

export const mockInitialColumns = {
  1: {
    header: 'participant_id',
  },
  2: {
    header: 'age',
  },
  3: {
    header: 'sex',
  },
  4: {
    header: 'group_dx',
  },
  5: {
    header: 'group',
  },
  6: {
    header: 'iq',
  },
};

export const mockInitialColumnsWithEmptyLine = {
  1: {
    header: 'participant_id',
  },
  2: {
    header: 'age',
  },
  3: {
    header: 'sex',
  },
  4: {
    header: 'group_dx',
  },
  5: {
    header: 'iq',
  },
};

export const mockColumns: Columns = {
  1: {
    header: 'participant_id',
    description: 'A participant ID',
    standardizedVariable: {
      identifier: 'nb:ParticipantID',
      label: 'Participant ID',
    },
    variableType: 'Identifier' as VariableType,
  },
  2: {
    header: 'age',
    description: 'Age of the participant',
    standardizedVariable: {
      identifier: 'nb:Age',
      label: 'Age',
    },
    variableType: 'Continuous' as VariableType,
    format: {
      termURL: 'nb:FromFloat',
      label: 'float',
    },
    units: '',
  },
  3: {
    header: 'sex',
    description: 'Sex of the participant',
    standardizedVariable: {
      identifier: 'nb:Sex',
      label: 'Sex',
    },
    variableType: 'Categorical' as VariableType,
    levels: {
      F: { description: 'Female', label: 'Female', termURL: 'snomed:248152002' },
      M: { description: 'Male', label: 'Male', termURL: 'snomed:248153007' },
    },
    missingValues: ['N/A'],
  },
  4: {
    header: 'group_dx',
    description: 'Diagnosis of the participant',
    standardizedVariable: {
      identifier: 'nb:Diagnosis',
      label: 'Diagnosis',
    },
    variableType: 'Categorical' as VariableType,
    levels: {
      ADHD: {
        description: 'Attention deficit hyperactivity disorder',
        label: 'Attention deficit hyperactivity disorder',
        termURL: 'snomed:406506008',
      },
      PD: {
        description: 'Parkinsons',
        label: 'Parkinsonism caused by methanol',
        termURL: 'snomed:870288002',
      },
    },
  },
  5: {
    header: 'group',
    description: 'The group assignment of the participant in a study.',
    variableType: 'Categorical' as VariableType,
    levels: {
      HC: { description: 'Healthy control', label: 'Healthy Control', termURL: 'ncit:C94342' },
    },
    standardizedVariable: {
      identifier: 'nb:Diagnosis',
      label: 'Diagnosis',
    },
    missingValues: ['Patient', 'N/A'],
  },
  6: {
    header: 'iq',
    description: 'iq test score of the participant',
    standardizedVariable: {
      identifier: 'nb:Assessment',
      label: 'Assessment Tool',
    },
    variableType: 'Collection' as VariableType,
    isPartOf: {
      termURL: 'snomed:273712001',
      label: 'Previous IQ assessment by pronunciation',
    },
  },
};

export const mockColumnsWithDataType = {
  1: {
    header: 'some_continuous_column',
    variableType: 'Continuous' as VariableType,
  },
  2: {
    header: 'age',
  },
  3: {
    header: 'sex',
    variableType: 'Categorical' as VariableType,
  },
};

export const mockDataDictionaryWithDescription = {
  participant_id: {
    Description: 'A participant ID',
  },
  age: {
    Description: 'Age of the participant',
  },
  sex: {
    Description: 'Sex of the participant',
  },
};

export const mockDataDictionaryWithNoDescription = {
  participant_id: {
    Description: '',
  },
  age: {
    Description: '',
  },
  sex: {
    Description: '',
  },
  group_dx: {
    Description: '',
  },
  group: {
    Description: '',
  },
  iq: {
    Description: '',
  },
};

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

export const mockStandardizedVariables = {
  'Participant ID': {
    identifier: 'nb:ParticipantID',
    label: 'Participant ID',
  },
  'Session ID': {
    identifier: 'nb:SessionID',
    label: 'Session ID',
  },
  Age: {
    identifier: 'nb:Age',
    label: 'Age',
  },
  Sex: {
    identifier: 'nb:Sex',
    label: 'Sex',
  },
  Diagnosis: {
    identifier: 'nb:Diagnosis',
    label: 'Diagnosis',
  },
  'Assessment Tool': {
    identifier: 'nb:Assessment',
    label: 'Assessment Tool',
  },
};

export const mockConfig: Config = {
  'nb:ParticipantID': {
    identifier: 'nb:ParticipantID',
    label: 'Participant ID',
    variable_type: 'Identifier' as VariableType,
    required: true,
    description: 'Unique participant identifier.',
    is_multi_column_measure: false,
    can_have_multiple_columns: false,
    same_as: undefined,
  },
  'nb:SessionID': {
    identifier: 'nb:SessionID',
    label: 'Session ID',
    variable_type: 'Identifier' as VariableType,
    required: false,
    description: 'Unique session identifier.',
    is_multi_column_measure: false,
    can_have_multiple_columns: false,
    same_as: undefined,
  },
  'nb:Age': {
    identifier: 'nb:Age',
    label: 'Age',
    variable_type: 'Continuous' as VariableType,
    required: false,
    description: 'The age of the participant.',
    is_multi_column_measure: false,
    can_have_multiple_columns: false,
    same_as: undefined,
    formats: [
      {
        termURL: 'nb:FromFloat',
        label: 'float',
        examples: ['31.5'],
      },
      {
        termURL: 'nb:FromEuro',
        label: 'euro',
        examples: ['31,5'],
      },
      {
        termURL: 'nb:FromBounded',
        label: 'bounded',
        examples: ['30+'],
      },
      {
        termURL: 'nb:FromRange',
        label: 'range',
        examples: ['30-35'],
      },
      {
        termURL: 'nb:FromISO8601',
        label: 'iso8601',
        examples: ['31Y6M'],
      },
    ],
  },
  'nb:Sex': {
    identifier: 'nb:Sex',
    label: 'Sex',
    variable_type: 'Categorical' as VariableType,
    required: false,
    description: 'The sex of the participant.',
    is_multi_column_measure: false,
    can_have_multiple_columns: false,
    same_as: undefined,
    terms: [
      {
        identifier: 'snomed:248153007',
        label: 'Male',
      },
      {
        identifier: 'snomed:248152002',
        label: 'Female',
      },
      {
        identifier: 'snomed:32570681000036106',
        label: 'Other',
      },
    ],
  },
  'nb:Diagnosis': {
    identifier: 'nb:Diagnosis',
    label: 'Diagnosis',
    variable_type: 'Categorical' as VariableType,
    required: false,
    description: 'Participant diagnosis information',
    is_multi_column_measure: false,
    can_have_multiple_columns: true,
    same_as: undefined,
    terms: [
      {
        identifier: 'snomed:1231282002',
        label: 'Self-limited familial neonatal-infantile epilepsy',
      },
      {
        identifier: 'snomed:1237571004',
        label: 'Self-limited familial infantile epilepsy',
      },
      {
        identifier: 'snomed:1259106002',
        label: 'Alexander disease type I',
      },
      { identifier: 'snomed:406506008', label: 'Attention deficit hyperactivity disorder' },
    ],
  },
  'nb:Assessment': {
    identifier: 'nb:Assessment',
    label: 'Assessment Tool',
    variable_type: 'Collection' as VariableType,
    required: false,
    description: 'A cognitive or clinical rating scale, instrument, or assessment tool.',
    is_multi_column_measure: true,
    can_have_multiple_columns: true,
    same_as: undefined,
    terms: [
      {
        identifier: 'snomed:1303696008',
        label: 'Robson Ten Group Classification System',
      },
      {
        identifier: 'snomed:1304062007',
        label: 'Malnutrition Screening Tool',
      },
      {
        identifier: 'snomed:1332329009',
        label: 'Interviewer led Chronic Respiratory Questionnaire',
      },
    ],
  },
};

// Test data for fetch functions
export const mockGitHubResponse = [
  { type: 'file', name: 'README.md' },
  { type: 'dir', name: 'Neurobagel' },
  { type: 'dir', name: 'OtherConfig' },
  { type: 'file', name: 'config.json' },
  { type: 'dir', name: 'TestConfig' },
];

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
      ],
    },
  ],
};

export const mockDiagnosisTerms = [
  {
    namespace_prefix: 'snomed',
    namespace_url: 'http://snomed.info/sct/',
    vocabulary_name: 'SNOMED CT',
    version: '1.0.0',
    terms: [
      {
        id: '123456789',
        name: 'Test Diagnosis',
      },
    ],
  },
];

export const mockFreshConfigFile: FreshConfigFile = {
  vocabulary_name: 'Neurobagel Phenotypic Variables',
  namespace_prefix: 'nb',
  namespace_url: 'http://neurobagel.org/vocab/',
  version: '1.0.0',
  standardized_variables: [
    {
      name: 'Participant ID',
      id: 'ParticipantID',
      variable_type: 'Identifier' as FreshVariableType,
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
      variable_type: 'Identifier' as FreshVariableType,
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
      variable_type: 'Continuous' as FreshVariableType,
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
      variable_type: 'Categorical' as FreshVariableType,
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
      variable_type: 'Categorical' as FreshVariableType,
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
      variable_type: 'Collection' as FreshVariableType,
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

export const mockAvailableConfigOptions = ['Neurobagel', 'OtherConfig', 'TestConfig'];

// Mock data for FreshDataStore based on mockConfigFile and mockTermsData
export const mockFreshStandardizedVariables = {
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

export const mockFreshStandardizedTerms = {
  'snomed:248153007': {
    standardizedVariableId: 'nb:Sex',
    id: 'snomed:248153007',
    label: 'Male',
  },
  'snomed:248152002': {
    standardizedVariableId: 'nb:Sex',
    id: 'snomed:248152002',
    label: 'Female',
  },
  'snomed:32570681000036106': {
    standardizedVariableId: 'nb:Sex',
    id: 'snomed:32570681000036106',
    label: 'Other',
  },
  'snomed:1231282002': {
    standardizedVariableId: 'nb:Diagnosis',
    id: 'snomed:1231282002',
    label: 'Self-limited familial neonatal-infantile epilepsy',
  },
  'snomed:1237571004': {
    standardizedVariableId: 'nb:Diagnosis',
    id: 'snomed:1237571004',
    label: 'Self-limited familial infantile epilepsy',
  },
  'snomed:1259106002': {
    standardizedVariableId: 'nb:Diagnosis',
    id: 'snomed:1259106002',
    label: 'Alexander disease type I',
  },
  'snomed:406506008': {
    standardizedVariableId: 'nb:Diagnosis',
    id: 'snomed:406506008',
    label: 'Attention deficit hyperactivity disorder',
  },
  'snomed:1303696008': {
    standardizedVariableId: 'nb:Assessment',
    id: 'snomed:1303696008',
    label: 'Robson Ten Group Classification System',
  },
  'snomed:1304062007': {
    standardizedVariableId: 'nb:Assessment',
    id: 'snomed:1304062007',
    label: 'Malnutrition Screening Tool',
  },
  'snomed:1332329009': {
    standardizedVariableId: 'nb:Assessment',
    id: 'snomed:1332329009',
    label: 'Interviewer led Chronic Respiratory Questionnaire',
  },
};

export const mockFreshStandardizedFormats = {
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
export const mockFreshColumnsAfterDataTableUpload = {
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
