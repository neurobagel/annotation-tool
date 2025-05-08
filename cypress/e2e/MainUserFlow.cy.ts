const mockDataTableFileName = 'mock.tsv';
const mockDataTableFilePath = `cypress/fixtures/examples/${mockDataTableFileName}`;
const mockDataDictionaryFileName = 'mock.json';
const mockDataDictionaryFilePath = `cypress/fixtures/examples/${mockDataDictionaryFileName}`;
const mockPartiallyAnnotatedDataDictionaryFileName = 'mock_annotated.json';
const mockPartiallyAnnotatedDataDictionaryFilePath = `cypress/downloads/${mockPartiallyAnnotatedDataDictionaryFileName}`;

// TODO: add tests for columns without standardized variables annotation

describe('Main user flow', () => {
  it('steps through different app views and goes through the basic user flow', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Welcome to the Neurobagel Annotation Tool');
    cy.get('[data-cy="next-button"]').click();

    // Upload view
    cy.get('[data-cy="back-button"]').should('contain', 'Landing');
    cy.get('[data-cy="next-button"]').should('contain', 'Column Annotation');
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

    cy.get('[data-cy="datadictionary-upload-input"]').should('not.be.disabled');
    cy.get('[data-cy="datadictionary-upload-input"]').selectFile(mockDataDictionaryFilePath, {
      force: true,
    });
    cy.get('[data-cy="datadictionary-uploaded-file-name"]').should(
      'contain',
      mockDataDictionaryFileName
    );
    cy.get('[data-cy="datadictionary-toggle-preview-button"]').click();
    cy.get('[data-cy="datadictionary-preview"]')
      .should('be.visible')
      .and('contain', 'Description:"Age of the participant"');
    cy.get('[data-cy="datadictionary-toggle-preview-button"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="back-button"]').should('contain', 'Upload');
    cy.get('[data-cy="next-button"]').should('contain', 'Value Annotation');
    cy.get('[data-cy="nav-stepper"]').should('be.visible');
    cy.get('[data-cy="Column Annotation-step"]').within(() => {
      cy.get('.MuiStepLabel-iconContainer').should('have.class', 'Mui-active');
    });
    cy.get('[data-cy="1-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="2-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="3-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="column-annotation-pagination"]').should('be.visible');
    cy.get('[data-cy="2-description"]').should('contain', 'Age of the participant');
    cy.get('[data-cy="2-edit-description-button"]').click();
    cy.get('[data-cy="2-description-input"]')
      .should('be.visible')
      .and('contain', 'Age of the participant');
    cy.get('[data-cy="2-description-input"]').clear();
    cy.get('[data-cy="2-description-input"]').type('some cool new description');
    cy.get('[data-cy="2-save-description-button"]').click();
    cy.get('[data-cy="2-description"]').should('contain', 'some cool new description');
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"]').type(
      'participant{downArrow}{enter}'
    );
    cy.get('[data-cy="2-column-annotation-card-standardized-variable-dropdown"]').type(
      'age{downArrow}{enter}'
    );
    cy.get('[data-cy="3-column-annotation-card-standardized-variable-dropdown"]').type(
      'sex{downArrow}{enter}'
    );
    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="back-button"]').should('contain', 'Column Annotation');
    cy.get('[data-cy="next-button"]').should('contain', 'Download');
    cy.contains('Value Annotation');
    cy.get('[data-cy="Value Annotation-step"]').within(() => {
      cy.get('.MuiStepLabel-iconContainer').should('have.class', 'Mui-active');
    });
    cy.get('[data-cy="side-column-nav-bar-annotated"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-unannotated"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-continuous"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-categorical"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-sex-sex"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-sex-select-button"]').click();
    cy.get('[data-cy="3-categorical"]')
      .should('be.visible')
      .and('contain', 'M')
      .and('contain', 'F');
    cy.get('[data-cy="side-column-nav-bar-other"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-age-age"]').should('be.visible');
    cy.get('[data-cy="next-button"]').click();

    // Download view
    cy.get('[data-cy="back-button"]').should('contain', 'Value Annotation');
    cy.contains('Download');
    cy.get('[data-cy="Download-step"]').within(() => {
      cy.get('.MuiStepLabel-iconContainer').should('have.class', 'Mui-active');
    });
    // TODO: uncomment this once the logic for handling levels is implemented in value annotations
    // cy.get('[data-cy="complete-annotations-alert"]').should('be.visible');
    cy.get('[data-cy="datadictionary-preview"]')
      .should('be.visible')
      .should('contain', 'Description:"some cool new description"');
    cy.get('[data-cy="datadictionary-toggle-preview-button"]').click();
    cy.get('[data-cy="datadictionary-preview"]').should('not.be.visible');
    // TODO: remove this once the logic for handling levels is implemented in value annotations
    cy.get('[data-cy="force-download-switch"]').click();
    cy.get('[data-cy="download-datadictionary-button"]').click();

    const outputFileName = `${mockDataDictionaryFileName.split('.')[0]}_annotated.json`;
    cy.readFile(`cypress/downloads/${outputFileName}`).then((fileContent) => {
      const fileContentString = JSON.stringify(fileContent);
      // Check that the old description has been replaced with the new one
      expect(fileContentString).to.not.contain('Age of the participant');
      expect(fileContentString).to.contain('some cool new description');
    });
  });
  it('steps through the different app workflows with a partially annotated data dictionary', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Upload view
    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockDataTableFilePath, {
      force: true,
    });
    cy.get('[data-cy="datadictionary-upload-input"]').selectFile(
      mockPartiallyAnnotatedDataDictionaryFilePath,
      {
        force: true,
      }
    );
    cy.get('[data-cy="datadictionary-uploaded-file-name"]').should(
      'contain',
      mockPartiallyAnnotatedDataDictionaryFileName
    );
    cy.get('[data-cy="datadictionary-toggle-preview-button"]').click();
    cy.get('[data-cy="datadictionary-preview"]')
      .should('be.visible')
      .and('contain', 'Description:"A participant ID"')
      .and('contain', 'Description:"some cool new description"')
      .and('contain', 'Units')
      .and('contain', 'Levels');
    cy.get('[data-cy="datadictionary-toggle-preview-button"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="2-edit-description-button"]').click();
    cy.get('[data-cy="2-description-input"]').clear();
    cy.get('[data-cy="2-description-input"]').type('Age of the participant');
    cy.get('[data-cy="2-save-description-button"]').click();
    cy.get('[data-cy="2-description"]').should('contain', 'Age of the participant');
    cy.get('[data-cy="2-column-annotation-card-data-type"').should('contain', 'Continuous');
    cy.get('[data-cy="3-column-annotation-card-data-type"').should('contain', 'Categorical');
    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="side-column-nav-bar-age-age"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-age-select-button"]').click();
    cy.get('[data-cy="2-edit-description-button"]').click();
    cy.get('[data-cy="2-description-input"]').clear();
    cy.get('[data-cy="2-description-input"]').type('Years');
    cy.get('[data-cy="2-save-description-button"]').click();

    cy.get('[data-cy="side-column-nav-bar-sex-sex"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-sex-select-button"]').click();
    cy.get('[data-cy="3-M-edit-description-button"]').click();
    cy.get('[data-cy="3-M-description-input"]').clear();
    cy.get('[data-cy="3-M-description-input"]').type('Male');
    cy.get('[data-cy="3-M-save-description-button"]').click();
    cy.get('[data-cy="3-M-description"]').should('contain', 'Male');
    cy.get('[data-cy="3-F-edit-description-button"]').click();
    cy.get('[data-cy="3-F-description-input"]').clear();
    cy.get('[data-cy="3-F-description-input"]').type('Female');
    cy.get('[data-cy="3-F-save-description-button"]').click();
    cy.get('[data-cy="3-F-description"]').should('contain', 'Female');
    cy.get('[data-cy="next-button"]').click();

    // Download view
    cy.get('[data-cy="datadictionary-preview"]')
      .should('be.visible')
      .and('contain', 'Description:"Age of the participant"')
      .and('contain', 'Units:"Years"')
      .and('contain', 'Description:"Male"')
      .and('contain', 'Description:"Female"');
    cy.get('[data-cy="datadictionary-toggle-preview-button"]').click();
    cy.get('[data-cy="force-download-switch"]').click();
    cy.get('[data-cy="download-datadictionary-button"]').click();

    const outputFileName = `${mockDataDictionaryFileName.split('.')[0]}_annotated.json`;
    cy.readFile(`cypress/downloads/${outputFileName}`).then((fileContent) => {
      const fileContentString = JSON.stringify(fileContent);
      // Check that the old description has been replaced with the new one
      expect(fileContentString).to.not.contain('some cool new description');
      expect(fileContentString).to.contain('Age of the participant');
      expect(fileContentString).to.contain('"Units":"Years"');
      expect(fileContentString).to.contain('"Description":"Male"');
      expect(fileContentString).to.contain('"Description":"Female"');
    });

    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockDataTableFilePath, {
      force: true,
    });
    cy.get('[data-cy="datadictionary-upload-input"]').selectFile(
      mockPartiallyAnnotatedDataDictionaryFilePath,
      {
        force: true,
      }
    );
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="2-description"]').should('contain', 'Age of the participant');
    cy.get('[data-cy="2-column-annotation-card-data-type"').should('contain', 'Continuous');
    cy.get('[data-cy="3-column-annotation-card-data-type"]').should('contain', 'Categorical');
    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="side-column-nav-bar-age-age"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-age-select-button"]').click();
    cy.get('[data-cy="2-description"]').should('contain', 'Years');
    cy.get('[data-cy="side-column-nav-bar-sex-sex"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-sex-select-button"]').click();
    cy.get('[data-cy="3-M-description"]').should('contain', 'Male');
    cy.get('[data-cy="3-F-description"]').should('contain', 'Female');
  });
});
