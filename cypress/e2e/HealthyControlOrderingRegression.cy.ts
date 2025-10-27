describe('Regression tests', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });
  it('"Healthy Control" is the first diagnosis term when filtering', () => {
    const mockTablePath = 'cypress/fixtures/examples/mock.tsv';

    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Upload view
    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockTablePath, {
      force: true,
    });
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="4-column-annotation-card-standardized-variable-dropdown"]').type(
      'diagnosis{downArrow}{enter}'
    );
    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="side-column-nav-bar-diagnosis-select-button"]').click();
    cy.get('[data-cy="4-tab"]').click();
    cy.get('[data-cy="4-ADHD-term-dropdown"]').click();
    cy.get('[role="listbox"]').should('be.visible');
    cy.get('[role="option"]').first().should('contain', 'Healthy Control');
  });
});
