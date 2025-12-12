describe('Multi-Column Measure Card Ordering Regression', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });

  it('should keep newly added assessment cards appended in order of creation', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    cy.get('[data-cy="config-card-dropdown"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-config-loading="false"]').should('exist');

    // Upload table
    cy.get('[data-cy="datatable-upload-input"]').selectFile('cypress/fixtures/examples/mock.tsv', {
      force: true,
    });
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation: mark two columns as Assessment Tool
    cy.get('[data-cy="3-column-annotation-card-standardized-variable-dropdown"]').type(
      'assessment{downArrow}{enter}'
    );
    cy.get('[data-cy="4-column-annotation-card-standardized-variable-dropdown"]').type(
      'assessment{downArrow}{enter}'
    );
    cy.get('[data-cy="next-button"]').click();

    // Multi-Column Measures view
    cy.get('[data-cy="multi-column-measures-tab-Assessment Tool"]').should('be.visible');

    // First card: pick a term that appears later in vocab order
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-0-title-dropdown"]').click();
    cy.get('[data-cy="multi-column-measures-card-0-title-dropdown"]').type('emotional function');
    cy.get('ul[role="listbox"] [role="option"]').first().click();
    cy.get('[data-cy="multi-column-measures-card-0-header"]').should(
      'contain',
      'emotional function'
    );

    // Second card: pick a vocab-first term; it should appear after the first card
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-1-title-dropdown"]').click();
    cy.get('[data-cy="multi-column-measures-card-1-title-dropdown"]').type('Robson Ten Group');
    cy.get('ul[role="listbox"] [role="option"]')
      .contains('Robson Ten Group Classification System')
      .click();

    cy.get('[data-cy="multi-column-measures-card-0-header"]').should(
      'contain',
      'emotional function'
    );
    cy.get('[data-cy="multi-column-measures-card-1-header"]').should(
      'contain',
      'Robson Ten Group Classification System'
    );
  });
});
