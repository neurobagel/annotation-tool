import { mockDataTableFilePath } from '../support/testConstants';

describe('Column Annotation Tour', () => {
  beforeEach(() => {
    // Set SHOW_COLUMN_ANNOTATION_TOUR environment variable to 'true' to allow the tour to run natively
    Cypress.env('SHOW_COLUMN_ANNOTATION_TOUR', true);
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });

    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="config-card-dropdown"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockDataTableFilePath, { force: true });
    cy.get('[data-cy="next-button"]').should('not.be.disabled').click();
  });

  it('should run through all tour steps and successfully store completion state', () => {
    cy.get('.react-joyride__tooltip').should('be.visible');
    cy.get('button[data-test-id="button-primary"]').click();

    cy.get('[data-tour="tour-column-list"]').should('exist');
    cy.get('button[data-test-id="button-primary"]').click();

    cy.get('[data-tour="tour-standardized-variables-list"]').should('exist');
    cy.get('button[data-test-id="button-primary"]').click();

    cy.contains('recognized assessment tools').should('be.visible');
    cy.get('[data-cy^="collection-item-"]').should('exist');
    cy.get('button[data-test-id="button-primary"]').click();

    cy.get('[data-tour="tour-search-filter"]').should('exist');
    cy.get('button[data-test-id="button-primary"]').click();

    cy.get('[data-tour="tour-bulk-action-bar"]').should('exist');
    cy.get('button[data-test-id="button-primary"]').click();

    // Verify session storage was updated by starting a new 'session' on the page
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockDataTableFilePath, { force: true });
    cy.get('[data-cy="next-button"]').should('not.be.disabled').click();
    // The tour should NOT immediately pop up again
    cy.get('.react-joyride__tooltip').should('not.exist');
  });

  it('should persist session storage state when skipping early', () => {
    cy.get('.react-joyride__tooltip', { timeout: 10000 }).should('be.visible');

    cy.get('button[data-test-id="button-skip"]').click();

    cy.get('.react-joyride__tooltip').should('not.exist');

    // Verification across reload (simulates session storage)
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockDataTableFilePath, { force: true });
    cy.get('[data-cy="next-button"]').should('not.be.disabled').click();

    cy.get('.react-joyride__tooltip').should('not.exist');
  });

  it('should allow user to manually re-open the tour from the top bar', () => {
    cy.get('button[data-test-id="button-skip"]').click();
    cy.get('.react-joyride__tooltip').should('not.exist');

    cy.get('[data-cy="tour-start-button"]').click();

    cy.get('.react-joyride__tooltip', { timeout: 10000 }).should('be.visible');
  });
});
