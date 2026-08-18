describe('Whitespace Rendering e2e', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });

  it('should display trailing whitespaces and empty strings correctly', () => {
    const whitespaceTablePath = 'cypress/fixtures/examples/whitespace_table.tsv';

    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    cy.get('[data-cy="datatable-upload-input"]').selectFile(whitespaceTablePath, {
      force: true,
    });

    // Check DataTablePreview
    cy.get('[data-cy="datatable-toggle-preview-button"]').click();

    // Headers
    cy.get('[data-cy="datatable-preview"]').should('contain.text', 'participant_id');
    cy.get('[data-cy="datatable-preview"]').should('contain.text', ' ');
    cy.get('[data-cy="datatable-preview"]').should('contain.text', 'diagnosis ');
    cy.get('[data-cy="datatable-preview"]').should('contain.text', 'session\n');
    cy.get('[data-cy="datatable-preview"]').should('contain.text', 'session\r');
    cy.get('[data-cy="datatable-preview"]').should('contain.text', 'session\r\n');

    // Cells
    cy.get('[data-cy="datatable-preview"]').should('contain.text', 'sub-01');
    cy.get('[data-cy="datatable-preview"]').should('contain.text', ' ');
    cy.get('[data-cy="datatable-preview"]').should('contain.text', 'diagnosis ');
    cy.get('[data-cy="datatable-preview"]').should('contain.text', 'session\n');
    cy.get('[data-cy="datatable-preview"]').should('contain.text', 'session\r');
    cy.get('[data-cy="datatable-preview"]').should('contain.text', 'session\r\n');

    cy.get('[data-cy="datatable-toggle-preview-button"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="0-column-annotation-card"]').should('contain.text', 'participant_id');
    cy.get('[data-cy="1-column-annotation-card"]').should('exist');
    cy.get('[data-cy="2-column-annotation-card"]').should('contain.text', ' ');
    cy.get('[data-cy="3-column-annotation-card"]').should('contain.text', 'diagnosis ');
    cy.get('[data-cy="4-column-annotation-card"]').should('contain.text', 'session\n');
    cy.get('[data-cy="5-column-annotation-card"]').should('contain.text', 'session\r');
    cy.get('[data-cy="6-column-annotation-card"]').should('contain.text', 'session\r\n');

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

    // Value Annotation view - Without Formatting Marks
    cy.get('[data-cy="side-column-nav-bar-annotated"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-annotated-toggle-button"]').click();

    cy.get('[data-cy="side-column-nav-bar-categorical-"]').should('exist');
    cy.get('[data-cy="side-column-nav-bar-categorical- "]').should('contain.text', ' ');
    cy.get('[data-cy="side-column-nav-bar-categorical-diagnosis "]').should(
      'contain.text',
      'diagnosis '
    );

    cy.get('[data-cy="side-column-nav-bar-categorical-select-button"]')
      .first()
      .click({ force: true });

    cy.get('[data-cy="1-tab"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="1-value-table-element"]').should('be.visible');
    cy.get('[data-cy="1--value"]').should('have.text', '');

    cy.get('[data-cy="2-tab"]').click();
    cy.get('[data-cy="2-value-table-element"]').should('be.visible');
    cy.get('[data-cy="2- -value"]').should('have.text', ' ');

    cy.get('[data-cy="3-tab"]').click();
    cy.get('[data-cy="3-value-table-element"]').should('be.visible');
    cy.get('[data-cy="3-diagnosis -value"]').should('have.text', 'diagnosis ');

    cy.get('[data-cy="4-tab"]').click();
    cy.get('[data-cy="4-value-table-element"]').should('be.visible');
    cy.get('[data-cy="4-value-table-element"]').should('contain.text', 'session\n');

    cy.get('[data-cy="5-tab"]').click();
    cy.get('[data-cy="5-value-table-element"]').should('be.visible');
    cy.get('[data-cy="5-value-table-element"]').should('contain.text', 'session\r');

    cy.get('[data-cy="6-tab"]').click();
    cy.get('[data-cy="6-value-table-element"]').should('be.visible');
    cy.get('[data-cy="6-value-table-element"]').should('contain.text', 'session\r\n');

    // Turn on Formatting Marks
    cy.get('input[type="checkbox"]').check();

    cy.get('[data-cy="1-tab"]').click();
    cy.get('[data-cy="1--value"]').should('have.text', '""');

    cy.get('[data-cy="2-tab"]').click();
    cy.get('[data-cy="2- -value"]').should('have.text', '·');

    cy.get('[data-cy="3-tab"]').click();
    cy.get('[data-cy="3-diagnosis -value"]').should('have.text', 'diagnosis·');

    cy.get('[data-cy="4-tab"]').click();
    cy.get('[data-cy="4-value-table-element"]').should('contain.text', 'session¶\n');

    cy.get('[data-cy="5-tab"]').click();
    cy.get('[data-cy="5-value-table-element"]').should('contain.text', 'session¤');

    cy.get('[data-cy="6-tab"]').click();
    cy.get('[data-cy="6-value-table-element"]').should('contain.text', 'session¤¶\n');

    cy.get('[data-cy="side-column-nav-bar-categorical- "]').should('contain.text', '·');
    cy.get('[data-cy="side-column-nav-bar-categorical-diagnosis "]').should(
      'contain.text',
      'diagnosis·'
    );
  });
});
