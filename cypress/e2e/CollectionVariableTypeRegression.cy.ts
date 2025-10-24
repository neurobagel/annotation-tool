describe('Regression tests for collection variable type', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });

    const mockTablePath = 'cypress/fixtures/examples/mock.tsv';
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockTablePath, {
      force: true,
    });
    cy.get('[data-cy="next-button"]').click();
  });
  it('Maps a column to assessment tool', () => {
    // Column Annotation view
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"]').type(
      'assess{downArrow}{enter}'
    );
    cy.get('[data-cy="next-button"]').click();

    // Multi-column measure view
    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="next-button"]').click();

    // Download view
    cy.get('[data-cy="force-download-switch"]').click();
    cy.get('[data-cy="download-datadictionary-button"]').click();

    cy.readFile('cypress/downloads/mock_annotated.json').then((fileContent) => {
      expect(fileContent.participant_id).to.not.have.property('Levels');
      expect(fileContent.participant_id).to.not.have.property('Units');
      expect(fileContent.participant_id.Annotations).to.not.have.property('Levels');
      expect(fileContent.participant_id.Annotations.VariableType).to.equal('Collection');
    });
  });
  it('Maps a column to assessment tool and selects Continuous data type', () => {
    // Column Annotation view
    cy.get('[data-cy="2-column-annotation-card-standardized-variable-dropdown"]').type(
      'assess{downArrow}{enter}'
    );
    cy.get('[data-cy="2-column-annotation-card-data-type-continuous-button"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Multi-column measure view
    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="next-button"]').click();

    // Download view
    cy.get('[data-cy="force-download-switch"]').click();
    cy.get('[data-cy="download-datadictionary-button"]').click();

    cy.readFile('cypress/downloads/mock_annotated.json').then((fileContent) => {
      expect(fileContent.age).to.have.property('Units');
      expect(fileContent.age.Annotations.VariableType).to.equal('Collection');
    });
  });
  it('Maps a column to assessment tool and selects Categorical data type', () => {
    // Column Annotation view
    cy.get('[data-cy="3-column-annotation-card-standardized-variable-dropdown"]').type(
      'assess{downArrow}{enter}'
    );
    cy.get('[data-cy="3-column-annotation-card-data-type-categorical-button"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Multi-column measure view
    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="side-column-nav-bar-assessment tool-select-button"]').click();
    cy.get('[data-cy="3-tab"]').click();
    cy.get('[data-cy="3-M-description"]').type('Male');
    cy.get('[data-cy="3-F-description"]').type('Female');
    cy.get('[data-cy="3-N/A-missing-value-yes"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Download view
    cy.get('[data-cy="force-download-switch"]').click();
    cy.get('[data-cy="download-datadictionary-button"]').click();

    cy.readFile('cypress/downloads/mock_annotated.json').then((fileContent) => {
      expect(fileContent.sex).to.have.property('Levels');
      expect(fileContent.sex.Annotations).to.not.have.property('Levels');
      expect(fileContent.sex.Annotations.VariableType).to.equal('Collection');
      expect(fileContent.sex.Levels.M.Description).to.equal('Male');
      expect(fileContent.sex.Levels.F.Description).to.equal('Female');
      expect(fileContent.sex.Annotations.MissingValues).to.include('N/A');
    });
  });
});
