import Instruction from '../../src/components/Instruction';

describe('Instruction', () => {
  beforeEach(() => {
    cy.mount(
      <Instruction title="Test Instruction">
        <p>This is a test instruction content.</p>
      </Instruction>
    );
  });
  it('renders the component correctly', () => {
    cy.get('[data-cy="instruction-button"]')
      .should('be.visible')
      .and('contain', 'How to use this page');
  });
  it('opens the dialog and checks its content', () => {
    cy.get('[data-cy="instruction-button"]').click();
    cy.get('[data-cy="instruction-dialog"]')
      .should('be.visible')
      .and('contain', 'Test Instruction')
      .and('contain', 'This is a test instruction content.');
  });
  it('closes the dialog', () => {
    cy.get('[data-cy="instruction-button"]').click();
    cy.get('[data-cy="instruction-close"]').click();
    cy.get('[data-cy="instruction-dialog"]').should('not.exist');
  });
});
