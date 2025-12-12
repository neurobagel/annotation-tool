const dataTableContent = `participant_id\tdiagnosis
sub-001\tpd
sub-002\thc
sub-003\t`;

const dataDictionaryContent = {
  diagnosis: {
    Description: 'Diagnosis column with old uppercase levels',
    Levels: {
      PD: { Description: 'Old PD' },
      HC: { Description: 'Old HC' },
    },
    Annotations: {
      IsAbout: { TermURL: 'nb:Diagnosis', Label: 'Diagnosis' },
      VariableType: 'Categorical',
      Levels: {
        PD: { TermURL: 'snomed:49049000', Label: "Parkinson's disease" },
        HC: { TermURL: 'ncit:C94342', Label: 'Healthy Control' },
      },
      MissingValues: [],
    },
  },
};

describe('Mismatched Levels Regression', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });

  it('should use levels generated from data table values when there is a mismatch between data table and data dictionary levels', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Wait for config to load
    cy.get('[data-cy="config-card-dropdown"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-config-loading="false"]').should('exist');

    // Upload data table and mismatched data dictionary
    cy.get('[data-cy="datatable-upload-input"]').selectFile(
      {
        contents: Buffer.from(dataTableContent),
        fileName: 'test3.tsv',
        mimeType: 'text/tab-separated-values',
      },
      { force: true }
    );

    cy.get('[data-cy="datadictionary-upload-input"]').selectFile(
      {
        contents: Buffer.from(JSON.stringify(dataDictionaryContent, null, 2)),
        fileName: 'test2_annotated.json',
        mimeType: 'application/json',
      },
      { force: true }
    );
    cy.get('[data-cy="next-button"]').click();

    // Ensure diagnosis is categorical and mapped
    cy.get('[data-cy="1-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="1-column-annotation-card-data-type"]').should('contain', 'Categorical');
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Diagnosis'
    );
    cy.get('[data-cy="next-button"]').click();

    // Assign terms to data table values
    cy.get('[data-cy="side-column-nav-bar-diagnosis-select-button"]').click();
    cy.get('[data-cy="1-categorical"]').should('be.visible');

    cy.get('[data-cy="1-pd-term-dropdown"]').type("Parkinson's disease{downArrow}{enter}");
    cy.get('[data-cy="1-pd-term-dropdown"] input').should('have.value', "Parkinson's disease");

    cy.get('[data-cy="1-hc-term-dropdown"]').type('Healthy Control{downArrow}{enter}');
    cy.get('[data-cy="1-hc-term-dropdown"] input').should('have.value', 'Healthy Control');
    cy.get('[data-cy="next-button"]').click();

    // Confirm the preview reflects data table values
    cy.get('[data-cy="datadictionary-preview"]').should('be.visible');
    cy.get('[data-cy="datadictionary-preview"]').should('contain', 'pd');
    cy.get('[data-cy="datadictionary-preview"]').should('contain', 'hc');
    cy.get('[data-cy="datadictionary-preview"]').should('not.contain', 'PD');
    cy.get('[data-cy="datadictionary-preview"]').should('not.contain', 'HC');
  });
});
