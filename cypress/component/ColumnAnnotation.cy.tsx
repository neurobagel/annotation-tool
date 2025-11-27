import ColumnAnnotation from '../../src/components/ColumnAnnotation';
import { useDataStore } from '../../src/stores/data';
import { DataType, Columns } from '../../src/utils/internal_types';
import { mockStandardizedVariables } from '../../src/utils/mocks';

const createMockColumns = (): Columns => ({
  '1': {
    id: '1',
    name: 'some column',
    description: 'This is some column',
    dataType: DataType.categorical,
    standardizedVariable: 'nb:Assessment',
    allValues: ['value-1', 'value-2'],
  },
  '2': {
    id: '2',
    name: 'another column',
    description: 'This is another column',
    dataType: DataType.continuous,
    standardizedVariable: null,
    allValues: ['10', '20'],
  },
  '3': {
    id: '3',
    name: 'third column',
    description: 'This is third column',
    dataType: DataType.categorical,
    standardizedVariable: 'nb:Sex',
    allValues: ['M', 'F'],
  },
  '4': {
    id: '4',
    name: 'fourth column',
    description: 'This is fourth column',
    dataType: DataType.continuous,
    standardizedVariable: 'nb:ParticipantID',
    allValues: ['100', '200'],
  },
});

describe('ColumnAnnotation', () => {
  beforeEach(() => {
    useDataStore.setState({
      columns: createMockColumns(),
      standardizedVariables: mockStandardizedVariables,
    });
  });

  it('renders the component correctly', () => {
    cy.mount(<ColumnAnnotation />);
    cy.get('[data-cy="column-annotation-container"]').should('be.visible');
    cy.get('[data-cy="1-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="1-description"] textarea')
      .should('be.visible')
      .and('have.value', 'This is some column');
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"] input')
      .should('be.visible')
      .and('have.value', 'Assessment Tool');
    cy.get('[data-cy="1-column-annotation-card-data-type-categorical-button"]')
      .should('be.visible')
      .and('have.class', 'Mui-selected');
    cy.get('[data-cy="2-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="2-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="2-description"] textarea')
      .should('be.visible')
      .and('have.value', 'This is another column');
    cy.get('[data-cy="2-column-annotation-card-standardized-variable-dropdown"] input')
      .should('be.visible')
      .and('have.value', '');
    cy.get('[data-cy="2-column-annotation-card-data-type-continuous-button"]')
      .should('be.visible')
      .and('have.class', 'Mui-selected');
  });

  it('allows scrolling to access all column cards', () => {
    cy.mount(<ColumnAnnotation />);
    cy.get('[data-cy="column-annotation-container"]').should('be.visible');

    // Initially visible cards
    cy.get('[data-cy="1-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="2-column-annotation-card"]').should('be.visible');

    // Scroll to bottom to access remaining cards
    cy.get('[data-cy="column-annotation-container"]').scrollTo('bottom');
    cy.get('[data-cy="3-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="4-column-annotation-card"]').should('be.visible');

    // Scroll back to top
    cy.get('[data-cy="column-annotation-container"]').scrollTo('top');
    cy.get('[data-cy="1-column-annotation-card"]').should('be.visible');
  });
  it('edits the description', () => {
    cy.mount(<ColumnAnnotation />);
    cy.get('[data-cy="1-description"] textarea')
      .first()
      .as('descriptionTextarea')
      .should('be.visible');
    cy.get('@descriptionTextarea').clear();
    cy.get('@descriptionTextarea').type('new description');
    cy.get('@descriptionTextarea').should('have.value', 'new description');
  });
  it('toggles the data type between categorical and continuous', () => {
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="1-column-annotation-card-data-type-categorical-button"]').should(
      'have.class',
      'Mui-selected'
    );
    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').should(
      'not.have.class',
      'Mui-selected'
    );

    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').click();

    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').should(
      'have.class',
      'Mui-selected'
    );
    cy.get('[data-cy="1-column-annotation-card-data-type-categorical-button"]').should(
      'not.have.class',
      'Mui-selected'
    );
  });
});
