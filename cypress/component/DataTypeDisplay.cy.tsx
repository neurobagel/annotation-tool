import DataTypeDisplay from '../../src/components/DataTypeDisplay';

describe('DataTypeDisplay', () => {
  it('should render the component with a mapped categorical value', () => {
    cy.mount(<DataTypeDisplay columnId="1" label="Categorical" />);
    cy.get('[data-cy="1-column-annotation-card-data-type"]')
      .should('be.visible')
      .and('contain', 'Categorical');
  });

  it('should show help icon and tooltip when isInferred is true', () => {
    cy.mount(<DataTypeDisplay columnId="2" label="Identifier" isInferred />);

    cy.get('[data-cy="2-column-annotation-card-data-type"]')
      .should('be.visible')
      .and('contain', 'Identifier');
    cy.get('[data-testid="HelpIcon"]').should('be.visible');

    cy.get('[data-cy="2-column-annotation-card-data-type"]').trigger('mouseover');
    cy.get('[role="tooltip"]').should('be.visible').and('contain', 'automatically determined');
  });

  it('should not show tooltip when isInferred is false', () => {
    cy.mount(<DataTypeDisplay columnId="3" label="Categorical" />);

    cy.get('[data-cy="3-column-annotation-card-data-type"]').trigger('mouseover');
    cy.get('[role="tooltip"]').should('not.exist');
  });

  it('should display placeholder when label is null', () => {
    cy.mount(<DataTypeDisplay columnId="4" label={null} />);

    cy.get('[data-cy="4-column-annotation-card-data-type-unassigned"]')
      .should('be.visible')
      .and('contain', 'Map to data type');
  });
});
