import { DataType, VariableType, type Columns, type StandardizedVariables } from '../../datamodel';
import ValueAnnotation from '../../src/components/ValueAnnotation';
import { useFreshDataStore } from '../../src/stores/FreshNewStore';
import { mockFreshStandardizedTerms, mockFreshStandardizedFormats } from '../../src/utils/mocks';

const createColumns = (): Columns => ({
  '1': {
    id: '1',
    name: 'some_continuous_column',
    allValues: ['5', '10'],
    dataType: DataType.continuous,
    missingValues: [],
  },
  '2': {
    id: '2',
    name: 'age',
    allValues: ['21', '25'],
    dataType: DataType.continuous,
    standardizedVariable: 'nb:Age',
    units: '',
    format: 'nb:FromFloat',
  },
  '3': {
    id: '3',
    name: 'sex',
    allValues: ['M', 'F', 'N/A'],
    dataType: DataType.categorical,
    levels: {
      M: { description: 'Male', standardizedTerm: 'snomed:248153007' },
      F: { description: 'Female', standardizedTerm: 'snomed:248152002' },
    },
    missingValues: ['N/A'],
  },
  '4': {
    id: '4',
    name: 'group_dx',
    allValues: ['ADHD', 'PD'],
    dataType: DataType.categorical,
    standardizedVariable: 'nb:Diagnosis',
    levels: {
      ADHD: {
        description: 'Attention deficit hyperactivity disorder',
        standardizedTerm: 'snomed:406506008',
      },
      PD: { description: 'Parkinsons', standardizedTerm: 'snomed:870288002' },
    },
  },
  '5': {
    id: '5',
    name: 'assessment_score',
    allValues: ['10', '20'],
    dataType: DataType.continuous,
    standardizedVariable: 'nb:Assessment',
    isPartOf: 'term:subscaleA',
    units: 'points',
  },
  '6': {
    id: '6',
    name: 'unknown_type',
    allValues: [''],
    dataType: null,
  },
});

const standardizedVariables: StandardizedVariables = {
  'nb:Diagnosis': {
    id: 'nb:Diagnosis',
    name: 'Diagnosis',
    variable_type: VariableType.categorical,
  },
  'nb:Assessment': {
    id: 'nb:Assessment',
    name: 'Assessment Tool',
    variable_type: VariableType.collection,
    is_multi_column_measure: true,
  },
  'nb:Age': {
    id: 'nb:Age',
    name: 'Age',
    variable_type: VariableType.continuous,
  },
};

describe('ValueAnnotation', () => {
  beforeEach(() => {
    useFreshDataStore.setState((state) => ({
      ...state,
      columns: createColumns(),
      standardizedVariables,
      standardizedTerms: {
        ...mockFreshStandardizedTerms,
        'term:subscaleA': {
          standardizedVariableId: 'nb:Assessment',
          id: 'term:subscaleA',
          label: 'Previous IQ assessment by pronunciation',
        },
      },
      standardizedFormats: mockFreshStandardizedFormats,
    }));
  });

  it('should render the component correctly', () => {
    cy.mount(<ValueAnnotation />);
    cy.get('[data-cy="no-column-selected"]')
      .should('be.visible')
      .and('contain', 'Please select a column to annotate values.');
    cy.get('[data-cy="side-column-nav-bar-diagnosis-select-button"]').click();
    cy.get('[data-cy="4-categorical"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-assessment tool-select-button"]').click();
    cy.get('[data-cy="5-continuous"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-unannotated"]').click();
    cy.get('[data-cy="side-column-nav-bar-categorical-select-button"]').click();
    cy.get('[data-cy="3-categorical"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-continuous-select-button"]').click();
    cy.get('[data-cy="1-continuous"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-other-select-button"]').click();
    cy.get('[data-cy="other"]')
      .should('be.visible')
      .and('contain', 'The following column do not have an assigned data type')
      .and('contain', 'unknown_type');
  });

  it('should not leak units edits between continuous columns', () => {
    cy.mount(<ValueAnnotation />);
    cy.get('[data-cy="side-column-nav-bar-age-select-button"]').click();
    cy.get('[data-cy="2-description"]').should('be.visible');
    cy.get('[data-cy="2-description"] textarea').first().clear();
    cy.get('[data-cy="2-description"]').type('Years');
    cy.get('[data-cy="side-column-nav-bar-unannotated"]').click();
    cy.get('[data-cy="side-column-nav-bar-continuous-select-button"]').click();
    cy.get('[data-cy="1-description"]').should('be.visible');
    cy.get('[data-cy="1-description"]').should('not.contain', 'Years');
  });
});
