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
  4: ['HC', 'HC', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'PD', 'HC', 'PD'],
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
    header: 'iq',
  },
};

export const mockColumns = {
  1: {
    header: 'participant_id',
    description: 'A participant ID',
    standardizedVariable: {
      identifier: 'nb:ParticipantID',
      label: 'Subject ID',
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
    format: {
      termURL: 'nb:FromFloat',
      label: 'Float',
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
    dataType: 'Categorical' as 'Categorical' | 'Continuous' | null,
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
    dataType: 'Categorical' as 'Categorical' | 'Continuous' | null,
    levels: {
      HC: { description: 'Healthy Control', label: 'Healthy Control', termURL: 'ncit:C94342' },
      PD: {
        description: 'Parkinsons',
        label: 'Parkinsonism caused by methanol',
        termURL: 'snomed:870288002',
      },
    },
  },
  5: {
    header: 'iq',
    description: 'iq test score of the participant',
    standardizedVariable: {
      identifier: 'nb:Assessment',
      label: 'Assessment Tool',
    },
    dataType: 'Continuous' as 'Categorical' | 'Continuous' | null,
    isPartOf: {
      termURL: 'snomed:273712001',
      label: 'Previous IQ assessment by pronunciation',
    },
    units: '',
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
  group_dx: {
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
        Label: 'Subject ID',
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
      Format: {
        TermURL: 'nb:FromFloat',
        Label: 'Float',
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
      HC: {
        Description: 'Healthy Control',
        TermURL: 'ncit:C94342',
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
        HC: {
          TermURL: 'ncit:C94342',
          Label: 'Healthy Control',
        },
        PD: {
          TermURL: 'snomed:870288002',
          Label: 'Parkinsonism caused by methanol',
        },
      },
    },
  },
  iq: {
    Description: 'iq test score of the participant',
    Units: '',
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
    identifier: 'nb:Assessment',
    label: 'Assessment Tool',
  },
};
