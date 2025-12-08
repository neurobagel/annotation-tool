describe('Value Annotation Tabs Overflow Regression', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });

  it('keeps the tabs in value annotation scrollable with many columns on one variable', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Upload view
    cy.get('[data-cy="datatable-upload-input"]').selectFile(
      'cypress/fixtures/examples/large_tsv_file.tsv',
      {
        force: true,
      }
    );
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    for (let i = 9; i <= 23; i += 1) {
      cy.get(`[data-cy="${i}-column-annotation-card-standardized-variable-dropdown"]`).click();
      cy.get('ul[role="listbox"] [role="option"]').contains('Assessment Tool').click();
    }
    cy.get('[data-cy="next-button"]').click();

    // Multi-Column Measures view
    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="side-column-nav-bar-assessment tool-select-button"]').click();
    cy.get('[data-cy="value-annotation-tabs"]').find('[role="tab"]').should('have.length', 15);

    // Layout should not overflow horizontally (tabs must scroll, not push the navbar).
    cy.get('[data-cy="value-annotation-layout"]').should(($el) => {
      const el = $el[0];
      expect(el.scrollWidth, 'layout should not overflow horizontally').to.be.at.most(
        el.clientWidth + 2
      );
    });
    cy.document().should((doc) => {
      const { documentElement: de } = doc;
      expect(de.scrollWidth, 'page should not overflow horizontally').to.be.at.most(
        de.clientWidth + 2
      );
    });
  });
});
