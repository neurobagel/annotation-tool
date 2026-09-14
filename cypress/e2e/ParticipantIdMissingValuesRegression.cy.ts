describe('Participant ID Missing Values Validation Regression', () => {
  const whitespaceTablePath = 'cypress/fixtures/examples/whitespace_table.tsv';

  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });

    cy.visit('/');
    cy.get('[data-cy="next-button"]').click();

    cy.get('[data-cy="datatable-upload-input"]').selectFile(whitespaceTablePath, {
      force: true,
    });
    cy.get('[data-cy="next-button"]').click();
  });

  it('should display an error alert when a column with empty or missing values is mapped to Participant ID and disappear when remapped', () => {
    // Column Annotation page
    cy.get('[data-cy="1-column-annotation-card"]').click();
    cy.get('[data-cy="standardized-variable-item-nb:ParticipantID"]').click();

    cy.get('[data-cy="participant-id-missing-values-error"]')
      .should('be.visible')
      .and('contain', 'Missing values in Participant ID column')
      .and('contain', 'contains missing or empty values')
      .and('contain', 'Please ensure every row has a valid participant ID in your tabular file.');

    cy.get('[data-cy="1-clear-mapped-variable"]').click();
    cy.get('[data-cy="participant-id-missing-values-error"]').should('not.exist');

    cy.get('[data-cy="0-column-annotation-card"]').click();
    cy.get('[data-cy="standardized-variable-item-nb:ParticipantID"]').click();
    cy.get('[data-cy="participant-id-missing-values-error"]').should('not.exist');
  });

  it('should display a warning alert when other columns are mapped but Participant ID is not mapped', () => {
    // Column Annotation page
    cy.get('[data-cy="3-column-annotation-card"]').click();
    cy.get('[data-cy="standardized-variable-item-nb:Diagnosis"]').click();

    cy.get('[data-cy="missing-participant-id-warning"]')
      .should('be.visible')
      .and('contain', 'Missing Participant ID column')
      .and('contain', 'You have not mapped a Participant ID column');

    cy.get('[data-cy="0-column-annotation-card"]').click();
    cy.get('[data-cy="standardized-variable-item-nb:ParticipantID"]').click();
    cy.get('[data-cy="missing-participant-id-warning"]').should('not.exist');
    cy.get('[data-cy="0-clear-mapped-variable"]').click();
    cy.get('[data-cy="missing-participant-id-warning"]')
      .should('be.visible')
      .and('contain', 'Missing Participant ID column');
  });

  it('should display missing values error on the column annotation page but does not show incomplete value annotations warning for Participant ID on the download page', () => {
    // Column Annotation page
    cy.get('[data-cy="3-column-annotation-card"]').click();
    cy.get('[data-cy="standardized-variable-item-nb:Diagnosis"]').click();

    cy.get('[data-cy="1-column-annotation-card"]').click();
    cy.get('[data-cy="standardized-variable-item-nb:ParticipantID"]').click();

    cy.get('[data-cy="participant-id-missing-values-error"]')
      .should('be.visible')
      .and('contain', 'Missing values in Participant ID column')
      .and('contain', 'contains missing or empty values');

    // Download page
    cy.get('[data-cy="Download-step"]').click();

    cy.get('[data-cy="participant-id-missing-values-error"]')
      .should('be.visible')
      .and('contain', 'Missing values in Participant ID column')
      .and('contain', 'contains missing or empty values');

    cy.get('[data-cy="complete-annotations-alert"]').should('not.exist');

    cy.get('[data-cy="incomplete-annotations-alert"]').should('be.visible');
    cy.get('[data-cy="incomplete-annotations-list"]')
      .should('contain', 'diagnosis')
      .and('not.contain', 'participant_id');

    cy.get('[data-cy="download-datadictionary-button"]').should('be.disabled');

    cy.get('[data-cy="force-download-switch"]').should('be.visible').click();
    cy.get('[data-cy="download-datadictionary-button"]').should('be.enabled');
  });
});
