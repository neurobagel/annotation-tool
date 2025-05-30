import MultiColumnMeasures from '../../src/components/MultiColumnMeasures';
import useDataStore from '../../src/stores/data';

describe('MultiColumnMeasures', () => {
  beforeEach(() => {
    // Mock the generateID function to return a predictable value for testing
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

    const updateColumnIsPartOfSpy = cy.spy().as('updateColumnIsPartOfSpy');

    useDataStore.setState({
      updateColumnIsPartOf: updateColumnIsPartOfSpy,
      columns: {
        '1': {
          header: 'some column',
          standardizedVariable: {
            identifier: 'nb:Assessment',
            label: 'Assessment Tool',
          },
          isPartOf: {
            termURL: 'someIdentifier',
            label: 'some term',
          },
        },
        '2': {
          header: 'another column',
          standardizedVariable: {
            identifier: 'nb:Assessment',
            label: 'Assessment Tool',
          },
        },
        '3': {
          header: 'some other column',
          standardizedVariable: {
            identifier: 'nb:Assessment',
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
    cy.get('[data-cy="multi-column-measures-card-mock-uuid-0-header"]').should(
      'contain',
      'some term'
    );
    cy.get('[data-cy="mapped-column-1"]').should('be.visible').and('contain', 'some column');
    cy.get('[data-cy="multi-column-measures-columns-card"]')
      .should('be.visible')
      .and('contain', 'some column')
      .and('contain', 'another column')
      .and('contain', 'some other column')
      .and('contain', '1 column assigned');
  });
  it('fires updateColumnIsPartOf with the  appropriate payload when a column is mapped to a term', () => {
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-mock-uuid-1-title-dropdown"]').should(
      'be.visible'
    );
    cy.get('[data-cy="multi-column-measures-card-mock-uuid-1-title-dropdown"]').type(
      'another term{downArrow}{enter}'
    );
    cy.get('[data-cy="multi-column-measures-card-mock-uuid-1-columns-dropdown"]').type(
      'another column{downArrow}{enter}'
    );
    cy.get('[data-cy="mapped-column-2"]').should('be.visible').and('contain', 'another column');
    cy.get('@updateColumnIsPartOfSpy').should('have.been.calledWith', '2', {
      identifier: 'anotherIdentifier',
      label: 'another term',
    });
  });
  it('fires updateColumnIsPartOf with the appropriate payload when a column is removed from a term card', () => {
    cy.get('[data-cy="mapped-column-1"]').should('be.visible').and('contain', 'some column');
    cy.get('[data-cy="mapped-column-1"] svg').click();
    cy.get('@updateColumnIsPartOfSpy').should('have.been.calledWith', '1', null);
    cy.get('[data-cy="mapped-column-1"]').should('not.exist');
  });
  it('fires updateColumnIsPartOf with the appropriate payload when a term card containing columns is removed', () => {
    cy.get('[data-cy="remove-card-mock-uuid-0-button"]').click();
    cy.get('@updateColumnIsPartOfSpy').should('have.been.calledWith', '1', null);
    cy.get('[data-cy="mapped-column-1"]').should('not.exist');
  });
});
