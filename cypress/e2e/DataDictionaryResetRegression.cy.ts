describe('Data Dictionary Reset Regression (Issue #635)', () => {
  const mockDataTableFilePath = 'cypress/fixtures/examples/mock.tsv';
  const mockDataDictionaryFilePath = 'cypress/fixtures/examples/mock.json';
  const mockPartiallyAnnotatedDataDictionaryFilePath =
    'cypress/fixtures/examples/mock_partially_annotated.json';

  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });

  it('should reset previous dictionary annotations and descriptions when a new data dictionary is uploaded', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Upload view
    cy.get('[data-cy="config-card-dropdown"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-config-loading="false"]').should('exist');
    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockDataTableFilePath, {
      force: true,
    });

    // Upload first data dictionary with descriptions for age and sex
    cy.get('[data-cy="datadictionary-upload-input"]').selectFile(mockDataDictionaryFilePath, {
      force: true,
    });
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    // Verify initial descriptions from first data dictionary
    cy.get('[data-cy="1-description"]').should('be.visible');
    cy.get('[data-cy="1-description"] textarea')
      .first()
      .should('have.value', 'Age of the participant');

    cy.get('[data-cy="2-description"]').should('be.visible');
    cy.get('[data-cy="2-description"] textarea')
      .first()
      .should('have.value', 'Sex of the participant');
    cy.get('[data-cy="back-button"]').click();

    // Upload view
    // Upload second data dictionary
    // age has "some cool new description" while sex has an empty Description
    cy.get('[data-cy="datadictionary-upload-input"]').selectFile(
      mockPartiallyAnnotatedDataDictionaryFilePath,
      {
        force: true,
      }
    );

    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    // Verify age description was updated with the new dictionary
    cy.get('[data-cy="1-description"]').should('be.visible');
    cy.get('[data-cy="1-description"] textarea')
      .first()
      .should('have.value', 'some cool new description');

    // Verify sex description from earlier upload was cleared
    cy.get('[data-cy="2-description"]').should('be.visible');
    cy.get('[data-cy="2-description"] textarea').first().should('have.value', '');
  });
});
