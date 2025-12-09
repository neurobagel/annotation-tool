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

    // Annotate many columns as "About" assessment tool
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

    // Tabs should be scrollable when too many; at least one scroll button should be enabled/visible.
    cy.get('[data-cy="value-annotation-tabs"] .MuiTabs-scrollButtons').should(($btns) => {
      expect($btns.length, 'scroll buttons should exist').to.be.greaterThan(0);
      const hasEnabled = Array.from($btns).some(
        (btn) => !btn.classList.contains('Mui-disabled') && btn.clientWidth > 0
      );
      expect(hasEnabled, 'at least one scroll button should be enabled/visible').to.equal(true);
    });

    // Layout should not overflow horizontally (tabs must scroll, not push the side navbar or page).
    cy.get('[data-cy="value-annotation-layout"]').should(($el) => {
      const el = $el[0];
      expect(el.scrollWidth, 'layout should stay within its container').to.be.at.most(
        el.clientWidth
      );
    });
    cy.document().should((doc) => {
      const { documentElement: de } = doc;
      expect(de.scrollWidth, 'page should not overflow horizontally').to.be.at.most(de.clientWidth);
    });
  });
});
