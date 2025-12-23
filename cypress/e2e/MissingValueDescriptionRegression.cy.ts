import { mockDataTableFilePath } from '../support/testConstants';

describe('Missing Value Description Regression', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });

  it('should reset the description for the level when it is marked missing during a debounced save', () => {
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

    cy.clock();
    cy.get('[data-cy="2-M-missing-value-no"]').click();
    cy.get('[data-cy="2-M-description"] textarea').first().should('not.be.disabled');
    cy.get('[data-cy="2-M-description"] textarea').first().type('Updated description');
    cy.get('[data-cy="2-M-missing-value-yes"]').click();
    cy.tick(501);
    cy.get('[data-cy="2-M-description"]').should('not.contain', 'Saving...');
    cy.get('[data-cy="2-M-description"] textarea').first().should('have.value', '');
  });
});
