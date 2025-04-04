import MultiColumnMeasures from '../../src/components/MultiColumnMeasures';

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
    cy.mount(<MultiColumnMeasures generateID={mockGenerateId} terms={mockTerms} />);
  });

  it('renders the component correctly', () => {
    cy.get('[data-cy="multi-column-measure-card-mock-uuid-0"]').should('be.visible');
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
    cy.get('[data-cy="multi-column-measure-card-mock-uuid-1"]').should('be.visible');
  });
});
