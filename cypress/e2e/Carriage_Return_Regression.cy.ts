describe('Regression tests', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });
  it('Uploads a .tsv with /r line endings and filters them out', () => {
    const carriageReturnTablePath = 'cypress/fixtures/examples/table_with_carriage_returns.tsv';
    const outputFileName = 'cypress/downloads/table_with_carriage_returns_annotated.json';
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    //  Upload a file with carriage returns (\r)
    cy.get('[data-cy="datatable-upload-input"]').selectFile(carriageReturnTablePath, {
      force: true,
    });
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="next-button"]').click();

    // Download view
    cy.get('[data-cy="download-datadictionary-button"]').click();

    cy.readFile(outputFileName).then((fileContent) => {
      const fileContentString = JSON.stringify(fileContent);
      // Check that the output string no longer contains a carriage return
      expect(fileContentString).to.not.contain('\\r');
    });
  });
});
