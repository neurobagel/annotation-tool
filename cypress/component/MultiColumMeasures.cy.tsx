import MultiColumnMeasures from '../../src/components/MultiColumnMeasures';
import useDataStore from '../../src/stores/data';

describe('MultiColumnMeasures', () => {
  beforeEach(() => {
    let counter = 0;
    const mockGenerateId = () => {
      const currentCount = counter;
      counter += 1;
      return `mock-uuid-${currentCount}`;
    };
    const mockTerms = [
      {
        identifier: 'someIdentifier',
        label: 'some term',
      },
      {
        identifier: 'anotherIdentifier',
        label: 'another term',
      },
      {
        identifier: 'someOtherIdentifier',
        label: 'some other term',
      },
    ];
    useDataStore.setState({
      columns: {
        '1': {
          header: 'some column',
          standardizedVariable: {
            identifier: 'nb:AssessmentTool',
            label: 'Assessment Tool',
          },
        },
        '2': {
          header: 'another column',
          standardizedVariable: {
            identifier: 'nb:AssessmentTool',
            label: 'Assessment Tool',
          },
        },
        '3': {
          header: 'some other column',
          standardizedVariable: {
            identifier: 'nb:AssessmentTool',
            label: 'Assessment Tool',
          },
        },
      },
    });
    cy.mount(<MultiColumnMeasures generateID={mockGenerateId} terms={mockTerms} />);
  });

  it('renders the component correctly', () => {
    cy.get('[data-cy="multi-column-measures-card-mock-uuid-0"]').should('be.visible');
    cy.get('[data-cy="remove-card-mock-uuid-0-button"]').should('be.visible');
    cy.get('[data-cy="multi-column-measures-card-mock-uuid-0-title-dropdown"]').should(
      'be.visible'
    );
    cy.get('[data-cy="multi-column-measures-card-mock-uuid-0-title-dropdown"]').type(
      'some term{downarrow}{enter}'
    );
    cy.get('[data-cy="multi-column-measures-card-mock-uuid-0-header"]').should(
      'contain',
      'some term'
    );
    cy.get('[data-cy="add-term-card-button"]').should('be.visible');
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-mock-uuid-1"]').should('be.visible');
    cy.get('[data-cy="remove-card-mock-uuid-1-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-mock-uuid-1"]').should('not.exist');
    cy.get('[data-cy="multi-column-measures-card-mock-uuid-0-columns-dropdown"]').should(
      'be.visible'
    );
    cy.get('[data-cy="multi-column-measures-columns-card"]')
      .should('be.visible')
      .and('contain', 'some column')
      .and('contain', 'another column')
      .and('contain', 'some other column')
      .and('contain', 'No columns assigned');

    cy.get('[data-cy="multi-column-measures-card-mock-uuid-0-columns-dropdown"]').type(
      'some column{downarrow}{enter}'
    );
    cy.get('[data-cy="mapped-column-1"]').should('be.visible').and('contain', 'some column');
    cy.get('[data-cy="multi-column-measures-columns-card"]').should('contain', '1 column assigned');
    cy.get('[data-cy="multi-column-measures-card-mock-uuid-0-columns-dropdown"]').clear();
    cy.get('[data-cy="multi-column-measures-card-mock-uuid-0-columns-dropdown"]').type(
      'another column{downarrow}{enter}'
    );
    cy.get('[data-cy="mapped-column-2"]').should('be.visible').and('contain', 'another column');
    cy.get('[data-cy="multi-column-measures-columns-card"]').should(
      'contain',
      '2 columns assigned'
    );
    cy.get('[data-cy="mapped-column-1"] svg').click();
    cy.get('[data-cy="mapped-column-1"]').should('not.exist');
    cy.get('[data-cy="multi-column-measures-columns-card"]').should('contain', '1 column assigned');
  });
});
