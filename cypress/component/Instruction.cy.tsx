import Instruction from '../../src/components/Instruction';

describe('Instruction', () => {
  it('renders the component correctly', () => {
    cy.mount(
      <Instruction title="Test Instruction">
        <p>This is a test instruction content.</p>
      </Instruction>
    );
    cy.get('[data-cy="instruction-button"]')
      .should('be.visible')
      .and('contain', 'How to use this page');

    cy.get('[data-cy="instruction-button"]').click();
    cy.get('[data-cy="instruction-dialog"]')
      .should('be.visible')
      .and('contain', 'Test Instruction')
      .and('contain', 'This is a test instruction content.');

    cy.get('[data-cy="instruction-close"]').click();
    cy.get('[data-cy="instruction-dialog"]').should('not.exist');
  });
});
