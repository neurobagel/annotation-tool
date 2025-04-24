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
  3: ['M', 'F', 'M', 'F', 'M', 'M', 'M', 'F', 'M', 'F', 'M', 'M'],
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
};

export const mockColumns = {
  1: {
    header: 'participant_id',
    description: 'A participant ID',
    standardizedVariable: {
      identifier: 'nb:ParticipantID',
      label: 'Subject Unique Identifier',
    },
    dataType: null as 'Categorical' | 'Continuous' | null,
  },
  2: {
    header: 'age',
    description: 'Age of the participant',
    standardizedVariable: {
      identifier: 'nb:Age',
      label: 'Age',
    },
    dataType: 'Continuous' as 'Categorical' | 'Continuous' | null,
    units: '',
  },
  3: {
    header: 'sex',
    description: 'Sex of the participant',
    standardizedVariable: {
      identifier: 'nb:Sex',
      label: 'Sex',
    },
    dataType: 'Categorical' as 'Categorical' | 'Continuous' | null,
    levels: {
      F: { description: '' },
      M: { description: '' },
    },
  },
};

export const mockColumnsWithDataType = {
  1: {
    header: 'some_continuous_column',
    dataType: 'Continuous' as 'Categorical' | 'Continuous' | null,
  },
  2: {
    header: 'age',
  },
  3: {
    header: 'sex',
    dataType: 'Categorical' as 'Categorical' | 'Continuous' | null,
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
};

export const mockDataDictionaryWithAnnotations = {
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
  age: {
    Description: 'Age of the participant',
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Age',
        Label: 'Age',
      },
    },
    Units: '',
  },
  sex: {
    Description: 'Sex of the participant',
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Sex',
        Label: 'Sex',
      },
    },
    Levels: {
      F: '',
      M: '',
    },
  },
};

export const mockStandardizedVariables = {
  'Subject ID': {
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
    identifier: 'nb:AssessmentTool',
    label: 'Assessment Tool',
  },
};
