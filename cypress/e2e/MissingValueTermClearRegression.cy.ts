import { mockDataTableFilePath } from '../support/testConstants';

describe('Missing Value Term Clear Regression', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });

  it('should clear a standardized term selection when the value is marked as missing', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Upload view
    cy.get('[data-cy="config-card-dropdown"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-config-loading="false"]').should('exist');
    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockDataTableFilePath, {
      force: true,
    });
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="column-annotation-container"]').should('be.visible');
    cy.get('[data-cy="2-column-annotation-card-standardized-variable-dropdown"]').type(
      'sex{downArrow}{enter}'
    );
    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="side-column-nav-bar-sex-select-button"]').click();
    cy.get('[data-cy="2-categorical"]').should('be.visible');

    // Select a standardized term, then mark the same value as missing.
    cy.get('[data-cy="2-N/A-term-dropdown"]').type('Female{downArrow}{enter}');
    cy.get('[data-cy="2-N/A-term-dropdown"] input').should('have.value', 'Female');

    cy.get('[data-cy="2-N/A-missing-value-yes"]').click();
    cy.get('[data-cy="2-N/A-missing-value-yes"]').should('have.attr', 'aria-pressed', 'true');
    cy.get('[data-cy="2-N/A-term-dropdown"] input').should('have.value', '');
    cy.get('[data-cy="2-N/A-term-dropdown"] input').should('be.disabled');
  });
});
