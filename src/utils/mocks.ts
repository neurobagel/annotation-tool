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

export const mockColumns = {
  1: {
    header: 'participant_id',
    description: 'A participant ID',
    standardizedVariable: {
      identifier: 'nb:ParticipantID',
      label: 'Participant ID',
    },
    bidsType: null as 'Categorical' | 'Continuous' | null,
  },
  2: {
    header: 'age',
    description: 'Age of the participant',
    standardizedVariable: {
      identifier: 'nb:Age',
      label: 'Age',
    },
    bidsType: 'Continuous' as 'Categorical' | 'Continuous' | null,
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
    bidsType: 'Categorical' as 'Categorical' | 'Continuous' | null,
    levels: {
      F: { description: '' },
      M: { description: '' },
      'N/A': { description: '' },
    },
  },
  4: {
    header: 'group_dx',
    description: 'Diagnosis of the participant',
    standardizedVariable: {
      identifier: 'nb:Diagnosis',
      label: 'Diagnosis',
    },
    bidsType: 'Categorical' as 'Categorical' | 'Continuous' | null,
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
    bidsType: null as 'Categorical' | 'Continuous' | null,
    missingValues: ['Patient', 'N/A'],
  },
  6: {
    header: 'iq',
    description: 'iq test score of the participant',
    standardizedVariable: {
      identifier: 'nb:Assessment',
      label: 'Assessment Tool',
    },
    bidsType: null as 'Categorical' | 'Continuous' | null,
    isPartOf: {
      termURL: 'snomed:273712001',
      label: 'Previous IQ assessment by pronunciation',
    },
  },
};

export const mockColumnsWithDataType = {
  1: {
    header: 'some_continuous_column',
    bidsType: 'Continuous' as 'Categorical' | 'Continuous' | null,
  },
  2: {
    header: 'age',
  },
  3: {
    header: 'sex',
    bidsType: 'Categorical' as 'Categorical' | 'Continuous' | null,
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
    },
    Units: '',
  },
  sex: {
    Description: 'Sex of the participant',
    Levels: {
      F: {
        Description: '',
      },
      M: {
        Description: '',
      },
      'N/A': {
        Description: '',
      },
    },
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Sex',
        Label: 'Sex',
      },
      Levels: {
        F: {
          TermURL: '',
          Label: '',
        },
        M: {
          TermURL: '',
          Label: '',
        },
        'N/A': {
          TermURL: '',
          Label: '',
        },
      },
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

export const mockConfig = {
  'nb:ParticipantID': {
    identifier: 'nb:ParticipantID',
    label: 'Participant ID',
    data_type: null as 'Categorical' | 'Continuous' | null,
    required: true,
    description: 'Unique participant identifier.',
    is_multi_column_measure: false,
    can_have_multiple_columns: false,
    same_as: undefined,
  },
  'nb:SessionID': {
    identifier: 'nb:SessionID',
    label: 'Session ID',
    data_type: null as 'Categorical' | 'Continuous' | null,
    required: false,
    description: 'Unique session identifier.',
    is_multi_column_measure: false,
    can_have_multiple_columns: false,
    same_as: undefined,
  },
  'nb:Age': {
    identifier: 'nb:Age',
    label: 'Age',
    data_type: 'Continuous' as 'Categorical' | 'Continuous' | null,
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
        termURL: 'nb:FromInt',
        label: 'int',
        examples: ['31'],
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
    data_type: 'Categorical' as 'Categorical' | 'Continuous' | null,
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
    data_type: 'Categorical' as 'Categorical' | 'Continuous' | null,
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
    data_type: null as 'Categorical' | 'Continuous' | null,
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

export const mockConfigFile = {
  vocabulary_name: 'Neurobagel Phenotypic Variables',
  namespace_prefix: 'nb',
  namespace_url: 'http://neurobagel.org/vocab/',
  version: '1.0.0',
  standardized_variables: [
    {
      name: 'Participant ID',
      id: 'ParticipantID',
      data_type: null as 'Categorical' | 'Continuous' | null,
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
      data_type: null as 'Categorical' | 'Continuous' | null,
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
      data_type: 'Continuous' as 'Categorical' | 'Continuous' | null,
      terms_file: undefined,
      formats: [
        {
          id: 'FromFloat',
          name: 'float',
          examples: ['31.5'],
        },
        {
          id: 'FromInt',
          name: 'int',
          examples: ['31'],
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
      data_type: 'Categorical' as 'Categorical' | 'Continuous' | null,
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
      data_type: 'Categorical' as 'Categorical' | 'Continuous' | null,
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
      data_type: null as 'Categorical' | 'Continuous' | null,
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
