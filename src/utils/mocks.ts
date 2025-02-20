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

export const mockDataDictionary = {
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
  pheno_age: {
    Description: 'Age of the participant',
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Age',
        Label: 'Age',
      },
    },
  },
  pheno_sex: {
    Description: 'Sex of the participant',
    Annotations: {
      IsAbout: {
        TermURL: 'nb:Sex',
        Label: 'Sex',
      },
    },
  },
};
