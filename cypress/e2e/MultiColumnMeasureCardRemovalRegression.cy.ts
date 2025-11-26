import { mockDataTableFileName, mockDataTableFilePath } from '../support/testConstants';

describe('Multi-Column Measure Card Removal Regression', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });

  it('should re-enable previously mapped columns after card removal', () => {
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

    cy.get('[data-cy="next-button"]').click();

    // Multi-Column Measures view
    cy.get('[data-cy="multi-column-measures-tab-Assessment Tool"]').should('be.visible');
    cy.get('[data-cy="multi-column-measures"]').should('contain.text', 'No columns assigned');

    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-0"]').should('be.visible');
    cy.get('[data-cy="multi-column-measures-card-0-title-dropdown"]').type(
      'Previous IQ assessment{downArrow}{enter}'
    );
    cy.get('[data-cy="multi-column-measures-card-0-header"]').should(
      'contain.text',
      'Previous IQ assessment by pronunciation'
    );

    // Map the "group" column to this card
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').type(
      'group{downArrow}{enter}'
    );
    cy.get('[data-cy="mapped-column-4"]').should('be.visible').and('contain', 'group');
    cy.get('[data-cy="multi-column-measures"]').should('contain.text', '1 column assigned');

    // Verify that "group" is now disabled in the dropdown (expected behavior)
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').click();
    cy.get('[role="option"]').contains('group').should('have.attr', 'aria-disabled', 'true');
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').type('{esc}');

    // Remove the card
    cy.get('[data-cy="remove-card-0-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-0"]').should('not.exist');
    cy.get('[data-cy="mapped-column-4"]').should('not.exist');
    cy.get('[data-cy="multi-column-measures"]').should('contain.text', 'No columns assigned');

    // Create a new card
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-0"]').should('be.visible');
    cy.get('[data-cy="multi-column-measures-card-0-title-dropdown"]').type(
      'Montreal cognitive{downArrow}{enter}'
    );
    cy.get('[data-cy="multi-column-measures-card-0-header"]').should(
      'contain.text',
      'Montreal cognitive assessment'
    );

    // Verify that "group" is now enabled again (this is where the bug would manifest)
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').click();
    cy.get('[role="option"]').contains('group').should('not.have.attr', 'aria-disabled', 'true');

    // Verify we can map the "group" column to the new card
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').type(
      'group{downArrow}{enter}'
    );
    cy.get('[data-cy="mapped-column-4"]').should('be.visible').and('contain', 'group');
    cy.get('[data-cy="multi-column-measures"]').should('contain.text', '1 column assigned');

    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').clear();
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').type(
      'iq{downArrow}{enter}'
    );
    cy.get('[data-cy="mapped-column-5"]').should('be.visible').and('contain', 'iq');
    cy.get('[data-cy="multi-column-measures"]').should('contain.text', '2 columns assigned');

    // Remove the card again and verify both columns are re-enabled
    cy.get('[data-cy="remove-card-0-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-0"]').should('not.exist');
    cy.get('[data-cy="multi-column-measures"]').should('contain.text', 'No columns assigned');

    // Create another card and verify both columns are available
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-0"]').should('be.visible');
    cy.get('[data-cy="multi-column-measures-card-0-title-dropdown"]').type(
      'Unified Parkinsons{downArrow}{enter}'
    );
    cy.get('[data-cy="multi-column-measures-card-0-header"]').should(
      'contain.text',
      'Unified Parkinsons disease rating scale'
    );
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').click();
    cy.get('[role="option"]').contains('group').should('not.have.attr', 'aria-disabled', 'true');
    cy.get('[role="option"]').contains('iq').should('not.have.attr', 'aria-disabled', 'true');

    // Map both columns to verify they work
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
  });
});
