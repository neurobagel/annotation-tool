import { mockDataTableFileName, mockDataTableFilePath } from '../support/testConstants';

describe('Multi-Column Measure Column Annotation Regression', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });

  it('should remove unassigned assessment columns from the dropdown', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Wait for config to load
    cy.get('[data-cy="config-card-dropdown"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-config-loading="false"]').should('exist');

    // Upload view
    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockDataTableFilePath, {
      force: true,
    });
    cy.get('[data-cy="datatable-uploaded-file-name"]').should('contain', mockDataTableFileName);
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="column-annotation-container"]').should('be.visible');
    cy.get('[data-cy="4-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="4-column-annotation-card-standardized-variable-dropdown"]').type(
      'assessment{downArrow}{enter}'
    );
    cy.get('[data-cy="5-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="5-column-annotation-card-standardized-variable-dropdown"]').type(
      'assessment{downArrow}{enter}'
    );

    // Multi-Column Measures view
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="multi-column-measures-tab-Assessment Tool"]').should('be.visible');
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-0"]').should('be.visible');
    cy.get('[data-cy="multi-column-measures-card-0-title-dropdown"]').type(
      'Previous IQ assessment{downArrow}{enter}'
    );
    cy.get('[data-cy="multi-column-measures-card-0-header"]').should(
      'contain.text',
      'Previous IQ assessment by pronunciation'
    );

    // Map both columns
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').type(
      'group{downArrow}{enter}'
    );
    cy.get('[data-cy="mapped-column-4"]').should('be.visible').and('contain', 'group');
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').clear();
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').type(
      'iq{downArrow}{enter}'
    );
    cy.get('[data-cy="mapped-column-5"]').should('be.visible').and('contain', 'iq');
    cy.get('[data-cy="multi-column-measures"]').should('contain.text', '2 columns assigned');

    // Unassign one column from the sidebar and verify it disappears from dropdown options
    cy.get('[data-cy="multi-column-measures-columns-side-bar"]').should('contain', 'iq');
    cy.get('[data-cy="unassign-column-5"]').click();
    cy.get('[data-cy="multi-column-measures-columns-side-bar"]').should('not.contain', 'iq');
    cy.get('[data-cy="multi-column-measures"]').should('contain.text', '1 column assigned');

    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').click();
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').clear();
    cy.get('[role="option"]').contains('group').should('be.visible');
    cy.get('[role="option"]').contains('iq').should('not.exist');
  });

  it('should surface newly annotated assessment columns after returning from column annotation', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Wait for config to load
    cy.get('[data-cy="config-card-dropdown"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-config-loading="false"]').should('exist');

    // Upload view
    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockDataTableFilePath, {
      force: true,
    });
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="column-annotation-container"]').should('be.visible');
    cy.get('[data-cy="4-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="4-column-annotation-card-standardized-variable-dropdown"]').type(
      'assessment{downArrow}{enter}'
    );
    cy.get('[data-cy="next-button"]').click();

    // Multi-Column Measures view
    cy.get('[data-cy="multi-column-measures-tab-Assessment Tool"]').should('be.visible');

    // create a card with the first column
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-0"]').should('be.visible');
    cy.get('[data-cy="multi-column-measures-card-0-title-dropdown"]').type(
      'Previous IQ assessment{downArrow}{enter}'
    );
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').type(
      'group{downArrow}{enter}'
    );
    cy.get('[data-cy="mapped-column-4"]').should('be.visible').and('contain', 'group');

    // Navigate back to Column Annotation and annotate an additional column as assessment
    cy.get('[data-cy="back-button"]').click();
    cy.get('[data-cy="5-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="5-column-annotation-card-standardized-variable-dropdown"]').type(
      'assessment{downArrow}{enter}'
    );

    // Return to Multi-Column Measures and verify the new column appears as an option
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="collapse-card-0-button"]').click();

    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').click();
    cy.get('[role="option"]').contains('group').should('be.visible');
    cy.get('[role="option"]').contains('iq').should('be.visible');
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').type(
      'iq{downArrow}{enter}'
    );
    cy.get('[data-cy="mapped-column-5"]').should('be.visible').and('contain', 'iq');
    cy.get('[data-cy="multi-column-measures"]').should('contain.text', '2 columns assigned');
  });
});
