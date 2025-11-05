import {
  mockDataTableFileName,
  mockDataTableFilePath,
  mockDataDictionaryFilePath,
} from '../support/testConstants';

describe('Main user flow', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });
  it('steps through different app views and goes through the basic user flow', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Upload View
    cy.get('[data-cy="back-button"]').should('contain', 'Landing');
    cy.get('[data-cy="next-button"]').should('contain', 'Column Annotation').and('be.disabled');
    cy.get('[data-cy="nav-stepper"]').should('be.visible');
    cy.get('[data-cy="Upload-step"]').within(() => {
      cy.get('.MuiStepLabel-iconContainer').should('have.class', 'Mui-active');
    });

    cy.get('[data-cy="datadictionary-upload-input"]').should('be.disabled');
    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockDataTableFilePath, {
      force: true,
    });
    cy.get('[data-cy="datatable-uploaded-file-name"]').should('contain', mockDataTableFileName);
    cy.get('[data-cy="datatable-toggle-preview-button"]').click();
    cy.get('[data-cy="datatable-preview"]').should('be.visible').and('contain', 'participant_id');
    cy.get('[data-cy="datatable-preview-pagination"]').should('be.visible');
    cy.get('[data-cy="datatable-toggle-preview-button"]').click();

    cy.get('[data-cy="datadictionary-upload-input"]').selectFile(mockDataDictionaryFilePath, {
      force: true,
    });
    cy.get('[data-cy="datadictionary-uploaded-file-name"]').should('contain', 'mock.json');
    cy.get('[data-cy="datadictionary-toggle-preview-button"]').click();
    cy.get('[data-cy="datadictionary-preview"]')
      .should('be.visible')
      .and('contain', 'Description:"A participant ID"')
      .and('contain', 'Description:"Age of the participant"');
    cy.get('[data-cy="datadictionary-toggle-preview-button"]').click();
    cy.get('[data-cy="next-button"]').click();
  });
});
