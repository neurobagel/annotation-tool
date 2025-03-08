const exampleDataTableFileName = 'mock.tsv';
const exampleDataTableFilePath = `cypress/fixtures/examples/${exampleDataTableFileName}`;
const exampleDataDictionaryFileName = 'mock.json';
const exampleDataDictionaryFilePath = `cypress/fixtures/examples/${exampleDataDictionaryFileName}`;

describe('Simple e2e test', () => {
  it('Steps through different app views and goes through the basic user flow', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Welcome to the Neurobagel Annotation Tool');
    cy.get('[data-cy="next-button"]').click();

    // Upload view
    cy.get('[data-cy="nav-stepper"]').should('be.visible');
    cy.get('[data-cy="Upload-step"]').within(() => {
      cy.get('.MuiStepLabel-iconContainer').should('have.class', 'Mui-active');
    });

    cy.get('[data-cy="datadictionary-upload-input"]').should('be.disabled');
    cy.get('[data-cy="datatable-upload-input"]').selectFile(exampleDataTableFilePath, {
      force: true,
    });
    cy.get('[data-cy="datatable-uploaded-file-name"]').should('contain', exampleDataTableFileName);
    cy.get('[data-cy="datatable-toggle-preview-button"]').click();
    cy.get('[data-cy="datatable-preview"]').should('be.visible').and('contain', 'participant_id');
    cy.get('[data-cy="datatable-preview-pagination"]').should('be.visible');
    cy.get('[data-cy="datatable-toggle-preview-button"]').click();

    cy.get('[data-cy="datadictionary-upload-input"]').should('not.be.disabled');
    cy.get('[data-cy="datadictionary-upload-input"]').selectFile(exampleDataDictionaryFilePath, {
      force: true,
    });
    cy.get('[data-cy="datadictionary-uploaded-file-name"]').should(
      'contain',
      exampleDataDictionaryFileName
    );
    cy.get('[data-cy="datadictionary-toggle-preview-button"]').click();
    cy.get('[data-cy="datadictionary-preview"]')
      .should('be.visible')
      .and('contain', 'Description:"Age of the participant"');
    cy.get('[data-cy="datadictionary-toggle-preview-button"]').click();
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
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
    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').click();
    cy.get('[data-cy="2-column-annotation-card-data-type-continuous-button"]').click();
    cy.get('[data-cy="3-column-annotation-card-data-type-categorical-button"]').click();
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
    cy.contains('Value Annotation');
    cy.get('[data-cy="Value Annotation-step"]').within(() => {
      cy.get('.MuiStepLabel-iconContainer').should('have.class', 'Mui-active');
    });
    cy.get('[data-cy="next-button"]').click();

    // Download view
    cy.contains('Download');
    cy.get('[data-cy="Download-step"]').within(() => {
      cy.get('.MuiStepLabel-iconContainer').should('have.class', 'Mui-active');
    });
    cy.get('[data-cy="complete-annotations-alert"]').should('be.visible');
    cy.get('[data-cy="datadictionary-preview"]')
      .should('be.visible')
      .should('contain', 'Description:"some cool new description"');
    cy.get('[data-cy="datadictionary-toggle-preview-button"]').click();
    cy.get('[data-cy="datadictionary-preview"]').should('not.be.visible');
    cy.get('[data-cy="download-datadictionary-button"]').click();

    const outputFileName = `${exampleDataDictionaryFileName.split('.')[0]}_annotated.json`;
    cy.readFile(`cypress/downloads/${outputFileName}`).then((fileContent) => {
      const fileContentString = JSON.stringify(fileContent);
      expect(fileContentString).to.not.contain('Age of the participant');
      expect(fileContentString).to.contain('some cool new description');
    });

    // TODO: Remove once the logic is there to check these in the output
    cy.get('[data-cy="back-button"]').click();
    cy.get('[data-cy="back-button"]').click();
    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"').should(
      'have.class',
      'Mui-selected'
    );
    cy.get('[data-cy="2-column-annotation-card-data-type-continuous-button"').should(
      'have.class',
      'Mui-selected'
    );
    cy.get('[data-cy="3-column-annotation-card-data-type-categorical-button"').should(
      'have.class',
      'Mui-selected'
    );
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Participant ID'
    );
    cy.get('[data-cy="2-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Age'
    );
    cy.get('[data-cy="3-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Sex'
    );
  });
});
