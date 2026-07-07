describe('Whitespace Rendering e2e', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });

  it('displays trailing whitespaces and empty strings correctly as raw strings', () => {
    const whitespaceTablePath = 'cypress/fixtures/examples/whitespace_table.tsv';

    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    cy.get('[data-cy="datatable-upload-input"]').selectFile(whitespaceTablePath, {
      force: true,
    });

    // Check DataTablePreview
    cy.get('[data-cy="datatable-toggle-preview-button"]').click();

    // Headers
    cy.get('[data-cy="datatable-preview"]').should('contain', '""');
    cy.get('[data-cy="datatable-preview"]').should('contain', '" "');
    cy.get('[data-cy="datatable-preview"]').should('contain', '"diagnosis "');
    cy.get('[data-cy="datatable-preview"]').should('contain', '"session\\n"');
    cy.get('[data-cy="datatable-preview"]').should('contain', '"session\\r"');
    cy.get('[data-cy="datatable-preview"]').should('contain', '"session\\r\\n"');

    // Cells
    cy.get('[data-cy="datatable-preview"]').should('contain', '""');
    cy.get('[data-cy="datatable-preview"]').should('contain', '" "');
    cy.get('[data-cy="datatable-preview"]').should('contain', '"diagnosis "');
    cy.get('[data-cy="datatable-preview"]').should('contain', '"session\\n"');
    cy.get('[data-cy="datatable-preview"]').should('contain', '"session\\r"');
    cy.get('[data-cy="datatable-preview"]').should('contain', '"session\\r\\n"');
    cy.get('[data-cy="datatable-preview"]').should('contain', '""');
    cy.get('[data-cy="datatable-preview"]').should('contain', '" "');
    cy.get('[data-cy="datatable-preview"]').should('contain', '"diagnosis "');
    cy.get('[data-cy="datatable-preview"]').should('contain', '"session\\n"');
    cy.get('[data-cy="datatable-preview"]').should('contain', '"session\\r"');
    cy.get('[data-cy="datatable-preview"]').should('contain', '"session\\r\\n"');

    cy.get('[data-cy="datatable-toggle-preview-button"]').click();

    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="0-column-annotation-card"]').should('contain', '"participant_id"');
    cy.get('[data-cy="1-column-annotation-card"]').should('contain', '""');
    cy.get('[data-cy="2-column-annotation-card"]').should('contain', '" "');
    cy.get('[data-cy="3-column-annotation-card"]').should('contain', '"diagnosis "');
    cy.get('[data-cy="4-column-annotation-card"]').should('contain', '"session\\n"');
    cy.get('[data-cy="5-column-annotation-card"]').should('contain', '"session\\r"');
    cy.get('[data-cy="6-column-annotation-card"]').should('contain', '"session\\r\\n"');

    cy.get('[data-cy="1-column-annotation-card"]').click();
    cy.get('[data-cy="bulk-assign-categorical"]').click();

    cy.get('[data-cy="2-column-annotation-card"]').click();
    cy.get('[data-cy="bulk-assign-categorical"]').click();

    cy.get('[data-cy="3-column-annotation-card"]').click();
    cy.get('[data-cy="bulk-assign-categorical"]').click();

    cy.get('[data-cy="4-column-annotation-card"]').click();
    cy.get('[data-cy="bulk-assign-categorical"]').click();

    cy.get('[data-cy="5-column-annotation-card"]').click();
    cy.get('[data-cy="bulk-assign-categorical"]').click();

    cy.get('[data-cy="6-column-annotation-card"]').click();
    cy.get('[data-cy="bulk-assign-categorical"]').click();

    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="side-column-nav-bar-annotated"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-annotated-toggle-button"]').click();

    cy.get('[data-cy="side-column-nav-bar-categorical-"]').should('contain', '""');
    cy.get('[data-cy="side-column-nav-bar-categorical- "]').should('contain', '" "');
    cy.get('[data-cy="side-column-nav-bar-categorical-diagnosis "]').should(
      'contain',
      '"diagnosis "'
    );
    cy.get('[data-cy="side-column-nav-bar-categorical-session\\\\n"]').should(
      'contain',
      '"session\\n"'
    );
    cy.get('[data-cy="side-column-nav-bar-categorical-session\\\\r"]').should(
      'contain',
      '"session\\r"'
    );
    cy.get('[data-cy="side-column-nav-bar-categorical-session\\\\r\\\\n"]').should(
      'contain',
      '"session\\r\\n"'
    );

    cy.get('[data-cy="side-column-nav-bar-categorical-select-button"]').click({ force: true });

    cy.get('[data-cy="1-tab"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="1-value-table-element"]').should('be.visible');
    cy.get('[data-cy="1-value-table-element"]').should('contain', '""');

    cy.get('[data-cy="2-tab"]').click();
    cy.get('[data-cy="2-tab"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="2-value-table-element"]').should('be.visible');
    cy.get('[data-cy="2-value-table-element"]').should('contain', '" "');

    cy.get('[data-cy="3-tab"]').click();
    cy.get('[data-cy="3-tab"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="3-value-table-element"]').should('be.visible');
    cy.get('[data-cy="3-value-table-element"]').should('contain', '"diagnosis "');

    cy.get('[data-cy="4-tab"]').click();
    cy.get('[data-cy="4-tab"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="4-value-table-element"]').should('be.visible');
    cy.get('[data-cy="4-value-table-element"]').should('contain', '"session\\n"');

    cy.get('[data-cy="5-tab"]').click();
    cy.get('[data-cy="5-tab"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="5-value-table-element"]').should('be.visible');
    cy.get('[data-cy="5-value-table-element"]').should('contain', '"session\\r"');

    cy.get('[data-cy="6-tab"]').click();
    cy.get('[data-cy="6-tab"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="6-value-table-element"]').should('be.visible');
    cy.get('[data-cy="6-value-table-element"]').should('contain', '"session\\r\\n"');
  });
});
