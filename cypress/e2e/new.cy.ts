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
  it('should step through the upload view and go through the basic user flow', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

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
  it('should step through the upload and column annotation views and go through the basic user flow', () => {
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
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="back-button"]').should('contain', 'Upload');
    cy.get('[data-cy="next-button"]').should('contain', 'Value Annotation');
    cy.get('[data-cy="nav-stepper"]').should('be.visible');
    cy.get('[data-cy="Column Annotation-step"]').within(() => {
      cy.get('.MuiStepLabel-iconContainer').should('have.class', 'Mui-active');
    });
    cy.get('[data-cy="1-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="1-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="2-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').click();
    cy.get('[data-cy="1-description"]').scrollIntoView();
    cy.get('[data-cy="1-description"]').should('be.visible');
    cy.get('[data-cy="1-description"]').type('A participant ID');
    cy.get('[data-cy="2-description"]').should('be.visible');
    cy.get('[data-cy="2-description"]').type('some cool new description');
    // Test that a single column standardized variable like "age" will be disabled once mapped to a column
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"]').type(
      'age{downArrow}{enter}'
    );
    cy.get('[data-cy="2-column-annotation-card-standardized-variable-dropdown"]').click();
    cy.get('ul[role="listbox"]')
      .last()
      .within(() => {
        cy.get('[role="option"]').contains('Age').should('have.attr', 'aria-disabled', 'true');
      });

    // Switch the column assignment to another variable and assert that age is now enabled again
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"]').type(
      'participant{downArrow}{enter}'
    );
    cy.get('[data-cy="2-column-annotation-card-standardized-variable-dropdown"]').click();
    cy.get('ul[role="listbox"]')
      .last()
      .within(() => {
        cy.get('[role="option"]').contains('Age').should('not.have.attr', 'aria-disabled', 'true');
      });
    cy.get('[data-cy="2-column-annotation-card-standardized-variable-dropdown"]').type(
      'age{downArrow}{enter}'
    );
    // Scroll to make the 3rd column annotation card visible
    cy.get('[data-cy="3-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="3-column-annotation-card-standardized-variable-dropdown"]').type(
      'sex{downArrow}{enter}'
    );
    // Scroll to make the 4th column annotation card visible
    cy.get('[data-cy="4-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="4-column-annotation-card-data-type-categorical-button"]').click();

    // Scroll to make the 5th column annotation card visible
    cy.get('[data-cy="5-column-annotation-card-data-type-categorical-button"]').click();
    cy.get('[data-cy="5-column-annotation-card-standardized-variable-dropdown"]').type(
      'diag{downArrow}{enter}'
    );
  });
});
