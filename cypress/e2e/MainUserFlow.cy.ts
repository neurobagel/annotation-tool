const mockDataTableFileName = 'mock.tsv';
const mockDataTableFilePath = `cypress/fixtures/examples/${mockDataTableFileName}`;
const mockDataDictionaryFileName = 'mock.json';
const mockDataDictionaryFilePath = `cypress/fixtures/examples/${mockDataDictionaryFileName}`;
const mockPartiallyAnnotatedDataDictionaryFileName = 'mock_annotated.json';
const mockPartiallyAnnotatedDataDictionaryFilePath = `cypress/downloads/${mockPartiallyAnnotatedDataDictionaryFileName}`;
const legacyDataTableFileName = 'example_synthetic.tsv';
const legacyDataTableFilePath = `cypress/fixtures/examples/${legacyDataTableFileName}`;
const legacyDataDictionaryFileName = 'example_synthetic.json';
const legacyDataDictionaryFilePath = `cypress/fixtures/examples/${legacyDataDictionaryFileName}`;

describe('Main user flow', () => {
  it('steps through different app views and goes through the basic user flow', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Welcome to the Neurobagel Annotation Tool');
    cy.get('[data-cy="next-button"]').click();

    // Wait for config skeleton to disappear and dropdown to be ready
    cy.get('[data-cy="config-card-dropdown"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-config-loading="false"]').should('exist');

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
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="back-button"]').should('contain', 'Upload');
    cy.get('[data-cy="next-button"]').should('contain', 'Value Annotation');
    cy.get('[data-cy="nav-stepper"]').should('be.visible');
    cy.get('[data-cy="Column Annotation-step"]').within(() => {
      cy.get('.MuiStepLabel-iconContainer').should('have.class', 'Mui-active');
    });
    cy.get('[data-cy="column-annotation-container"]').should('be.visible');
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
    cy.get('[role="option"]').contains('Age').should('have.attr', 'aria-disabled', 'true');
    // Switch the column assignment to another variable and assert that age is now enabled again
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"]').type(
      'participant{downArrow}{enter}'
    );
    cy.get('[data-cy="2-column-annotation-card-standardized-variable-dropdown"]').click();
    cy.get('[role="option"]').contains('Age').should('not.have.attr', 'aria-disabled', 'true');
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
    cy.get('[data-cy="side-column-nav-bar-categorical-group_dx"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-categorical-select-button"]').click();
    cy.get('[data-cy="4-categorical"]')
      .should('be.visible')
      .and('contain', 'HC')
      .and('contain', 'PD');
    cy.get('[data-cy="side-column-nav-bar-sex-sex"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-age-select-button"]').click();
    cy.get('[data-cy="2-continuous"]').should('be.visible');
    cy.get('[data-cy="2-format-dropdown"]').type('float{downArrow}{enter}');
    cy.get('[data-cy="2-description"]').should('be.visible');
    cy.get('[data-cy="2-description"]').type('some cool unit');
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
    cy.get('[data-cy="complete-annotations-alert"]').should('be.visible');
    cy.get('[data-cy="datadictionary-preview"]')
      .should('be.visible')
      .should('contain', 'Description:"some cool new description"');
    cy.get('[data-cy="datadictionary-toggle-preview-button"]').click();
    cy.get('[data-cy="datadictionary-preview"]').should('not.be.visible');
    cy.get('[data-cy="download-datadictionary-button"]').click();

    const outputFileName = `${mockDataDictionaryFileName.split('.')[0]}_annotated.json`;
    cy.readFile(`cypress/downloads/${outputFileName}`).then((fileContent) => {
      const fileContentString = JSON.stringify(fileContent);
      // Check that the old description has been replaced with the new one
      expect(fileContentString).to.not.contain('Age of the participant');
      expect(fileContentString).to.contain('some cool new description');
      expect(fileContentString).to.contain('"Units":"some cool unit"');
    });
  });
  it('steps through the different app workflows with a partially annotated data dictionary', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Wait for config skeleton to disappear and dropdown to be ready
    cy.get('[data-cy="config-card-dropdown"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-config-loading="false"]').should('exist');

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
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"]').type(
      'participant ID{downArrow}{enter}'
    );
    cy.get('[data-cy="2-description"]').should('be.visible');
    cy.get('[data-cy="2-description"] textarea').first().clear();
    cy.get('[data-cy="2-description"]').type('Age of the participant');
    cy.get('[data-cy="2-column-annotation-card-data-type"').should('contain', 'Continuous');
    cy.get('[data-cy="3-column-annotation-card-data-type"').should('contain', 'Categorical');

    // Scroll to access the 4th and 5th column annotation cards
    cy.get('[data-cy="4-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="4-column-annotation-card-standardized-variable-dropdown"]').type(
      'diagnosis{downArrow}{enter}'
    );
    cy.get('[data-cy="5-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="5-column-annotation-card-standardized-variable-dropdown"]').type(
      'assessment{downArrow}{enter}'
    );
    cy.get('[data-cy="next-button"]').should('contain', 'Multi-Column Measures');
    cy.get('[data-cy="next-button"]').click();

    // Multi-Column Measures view
    cy.get('[data-cy="back-button"]').should('contain', 'Column Annotation');
    cy.get('[data-cy="next-button"]').should('contain', 'Value Annotation');
    cy.get('[data-cy="nav-stepper"]').should('be.visible');
    cy.get('[data-cy="Column Annotation-step"]').within(() => {
      cy.get('.MuiStepLabel-iconContainer').should('have.class', 'Mui-active');
    });
    cy.get('[data-cy="multi-column-measures-card-0"]').should('be.visible');
    cy.get('[data-cy="multi-column-measures"]').should('contain.text', 'No columns assigned');
    cy.get('[data-cy="multi-column-measures-card-0-title-dropdown"]').type(
      'Previous IQ assessment{downArrow}{enter}'
    );
    cy.get('[data-cy="multi-column-measures-card-0-header"]').should(
      'contain.text',
      'Previous IQ assessment by pronunciation'
    );
    cy.get('[data-cy="multi-column-measures-card-0-columns-dropdown"]').type(
      'iq{downArrow}{enter}'
    );
    cy.get('[data-cy="mapped-column-5').should('be.visible').and('contain', 'iq');
    cy.get('[data-cy="multi-column-measures"]').should('contain.text', '1 column assigned');
    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="side-column-nav-bar-age-age"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-age-select-button"]').click();
    cy.get('[data-cy="2-description"]').should('be.visible');
    cy.get('[data-cy="2-description"] textarea').first().clear();
    cy.get('[data-cy="2-description"]').type('Years');
    cy.get('[data-cy="side-column-nav-bar-sex-sex"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-sex-select-button"]').click();
    cy.get('[data-cy="3-M-description"]').should('be.visible');
    cy.get('[data-cy="3-M-description"]').type('Male');
    cy.get('[data-cy="3-M-term-dropdown"]').type('Male{downArrow}{enter}');
    cy.get('[data-cy="3-F-description"]').should('be.visible');
    cy.get('[data-cy="3-F-description"]').type('Female');
    cy.get('[data-cy="3-F-term-dropdown"]').type('Female{downArrow}{enter}');
    cy.get('[data-cy="3-N/A-missing-value-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-diagnosis-group_dx"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-diagnosis-select-button"]').click();
    cy.get('[data-cy="4-HC-description"]').should('be.visible');
    cy.get('[data-cy="4-HC-description"]').type('Healthy control');
    cy.get('[data-cy="4-HC-term-dropdown"]').type('Healthy control{downArrow}{enter}');
    cy.get('[data-cy="4-PD-description"]').should('be.visible');
    cy.get('[data-cy="4-PD-description"]').type('Parkinsons');
    cy.get('[data-cy="4-PD-term-dropdown"]').type(
      'Parkinsonism caused by methanol{downArrow}{enter}'
    );
    cy.get('[data-cy="side-column-nav-bar-assessment tool-select-button"]').click();
    cy.get('[data-cy="5-continuous"]').should('be.visible');
    cy.get('[data-cy="5-continuous-table"]').should('be.visible').and('contain.text', '110');
    cy.get('[data-cy="next-button"]').click();

    // Download view
    cy.get('[data-cy="complete-annotations-alert"]').should('be.visible');
    cy.get('[data-cy="datadictionary-preview"]')
      .should('be.visible')
      .and('contain', 'Description:"Age of the participant"')
      .and('contain', 'Units:"Years"')
      .and('contain', 'Description:"Male"')
      .and('contain', 'Description:"Female"');
    cy.get('[data-cy="datadictionary-toggle-preview-button"]').click();
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
    cy.get('[data-cy="annotate-new-dataset-button"]').click();

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
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="2-description"]').should('contain', 'Age of the participant');
    cy.get('[data-cy="2-column-annotation-card-standardized-variable-dropdown"]').click();
    cy.get('[data-cy="2-column-annotation-card-data-type"').should('contain', 'Continuous');
    cy.get('[data-cy="3-column-annotation-card-data-type"]').should('contain', 'Categorical');
    cy.get('[data-cy="1-column-annotation-card-data-type"]').should('contain', 'Not applicable');

    // Scroll to access the 4th column annotation card
    cy.get('[data-cy="4-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="4-column-annotation-card-data-type"]').should('contain', 'Categorical');
    cy.get('[data-cy="next-button"]').click();

    // Multi-Column Measures view
    cy.get('[data-cy="multi-column-measures-card-0"]').should('be.visible');
    cy.get('[data-cy="multi-column-measures-card-0-header"]').should(
      'contain.text',
      'Previous IQ assessment by pronunciation'
    );
    cy.get('[data-cy="mapped-column-5').should('be.visible').and('contain', 'iq');
    cy.get('[data-cy="multi-column-measures"]').should('contain.text', '1 column assigned');
    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="side-column-nav-bar-age-age"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-age-select-button"]').click();
    cy.get('[data-cy="2-description"]').should('contain', 'Years');
    cy.get('[data-cy="2-format-dropdown"] input').should('have.value', 'float');
    cy.get('[data-cy="side-column-nav-bar-sex-sex"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-sex-select-button"]').click();
    cy.get('[data-cy="3-M-description"]').should('contain', 'Male');
    cy.get('[data-cy="3-M-term-dropdown"] input').should('have.value', 'Male');
    cy.get('[data-cy="3-F-description"]').should('contain', 'Female');
    cy.get('[data-cy="3-F-term-dropdown"] input').should('have.value', 'Female');
    cy.get('[data-cy="side-column-nav-bar-diagnosis-group_dx"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-diagnosis-select-button"]').click();
    cy.get('[data-cy="4-HC-description"]').should('contain', 'Healthy control');
    cy.get('[data-cy="4-HC-term-dropdown"] input').should('have.value', 'Healthy Control');
    cy.get('[data-cy="4-PD-description"]').should('contain', 'Parkinsons');
    cy.get('[data-cy="4-PD-term-dropdown"] input').should(
      'have.value',
      'Parkinsonism caused by methanol'
    );
    cy.get('[data-cy="next-button"]').click();

    // Download view
    cy.get('[data-cy="complete-annotations-alert"]').should('be.visible');
    cy.get('[data-cy="download-datadictionary-button"]').click();

    cy.readFile(`cypress/downloads/${outputFileName}`).then((fileContent) => {
      expect(fileContent.participant_id.Description).to.equal('A participant ID');
      expect(fileContent.participant_id.Annotations.IsAbout.TermURL).to.equal('nb:ParticipantID');
      expect(fileContent.participant_id.Annotations.IsAbout.Label).to.equal('Participant ID');
      expect(fileContent.participant_id.Annotations.Identifies).to.equal('participant');

      expect(fileContent.age.Description).to.equal('Age of the participant');
      expect(fileContent.age.Annotations.IsAbout.TermURL).to.equal('nb:Age');
      expect(fileContent.age.Annotations.IsAbout.Label).to.equal('Age');
      expect(fileContent.age.Units).to.equal('Years');
      expect(fileContent.age.Annotations.Format.TermURL).to.equal('nb:FromFloat');
      expect(fileContent.age.Annotations.Format.Label).to.equal('float');

      expect(fileContent.sex.Description).to.equal('');
      expect(fileContent.sex.Annotations.IsAbout.TermURL).to.equal('nb:Sex');
      expect(fileContent.sex.Annotations.IsAbout.Label).to.equal('Sex');
      expect(fileContent.sex.Levels.M.Description).to.equal('Male');
      expect(fileContent.sex.Levels.M.TermURL).to.equal('snomed:248153007');
      expect(fileContent.sex.Levels.F.Description).to.equal('Female');
      expect(fileContent.sex.Levels.F.TermURL).to.equal('snomed:248152002');
      expect(fileContent.sex.Annotations.Levels.M.TermURL).to.equal('snomed:248153007');
      expect(fileContent.sex.Annotations.Levels.M.Label).to.equal('Male');
      expect(fileContent.sex.Annotations.Levels.F.TermURL).to.equal('snomed:248152002');
      expect(fileContent.sex.Annotations.Levels.F.Label).to.equal('Female');
      expect(fileContent.sex.Annotations.MissingValues).to.include('N/A');

      expect(fileContent.group_dx.Description).to.equal('');
      expect(fileContent.group_dx.Annotations.IsAbout.TermURL).to.equal('nb:Diagnosis');
      expect(fileContent.group_dx.Annotations.IsAbout.Label).to.equal('Diagnosis');
      expect(fileContent.group_dx.Levels.HC.Description).to.equal('Healthy control');
      expect(fileContent.group_dx.Levels.HC.TermURL).to.equal('ncit:C94342');
      expect(fileContent.group_dx.Levels.PD.Description).to.equal('Parkinsons');
      expect(fileContent.group_dx.Levels.PD.TermURL).to.equal('snomed:870288002');
      expect(fileContent.group_dx.Annotations.Levels.HC.TermURL).to.equal('ncit:C94342');
      expect(fileContent.group_dx.Annotations.Levels.HC.Label).to.equal('Healthy Control');
      expect(fileContent.group_dx.Annotations.Levels.PD.TermURL).to.equal('snomed:870288002');
      expect(fileContent.group_dx.Annotations.Levels.PD.Label).to.equal(
        'Parkinsonism caused by methanol'
      );

      expect(fileContent.iq.Description).to.equal('');
      expect(fileContent.iq.Annotations.IsAbout.TermURL).to.equal('nb:Assessment');
      expect(fileContent.iq.Annotations.IsAbout.Label).to.equal('Assessment Tool');
      expect(fileContent.iq.Annotations.IsPartOf.TermURL).to.equal('snomed:273712001');
      expect(fileContent.iq.Annotations.IsPartOf.Label).to.equal(
        'Previous IQ assessment by pronunciation'
      );
    });
  });
  it('loads in a data dictionary from the legacy annotation tool', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Wait for config skeleton to disappear and dropdown to be ready
    cy.get('[data-cy="config-card-dropdown"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-config-loading="false"]').should('exist');

    cy.get('[data-cy="datatable-upload-input"]').selectFile(legacyDataTableFilePath, {
      force: true,
    });
    cy.get('[data-cy="datadictionary-upload-input"]').selectFile(legacyDataDictionaryFilePath, {
      force: true,
    });
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="1-description"]').should('contain', 'A participant ID');
    cy.get('[data-cy="1-column-annotation-card-data-type"]').should('contain', 'Not applicable');
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Participant ID'
    );
    cy.get('[data-cy="2-description"]').should('contain', 'A session ID');
    cy.get('[data-cy="3-description"]').should('contain', 'Age of the participant');
    cy.get('[data-cy="3-column-annotation-card-data-type"]').should('contain', 'Continuous');
    cy.get('[data-cy="3-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Age'
    );
    // Scroll to access the 4th column annotation card
    cy.get('[data-cy="4-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="4-description"]').should('contain', 'Sex');
    cy.get('[data-cy="4-column-annotation-card-data-type"]').should('contain', 'Categorical');
    cy.get('[data-cy="4-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Sex'
    );
    cy.get('[data-cy="5-description"]').should('contain', 'Group variable');
    cy.get('[data-cy="5-column-annotation-card-data-type"]').should('contain', 'Categorical');
    cy.get('[data-cy="5-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Diagnosis'
    );
    cy.get('[data-cy="6-description"]').should('contain', 'item 1 scores for tool1');
    cy.get('[data-cy="6-column-annotation-card-data-type"]').should('contain', 'Continuous');
    cy.get('[data-cy="6-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Assessment Tool'
    );
    // Scroll to access the 7th and 8th column annotation cards
    cy.get('[data-cy="7-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="7-description"]').should('contain', 'item 2 scores for tool1');
    cy.get('[data-cy="7-column-annotation-card-data-type"]').should('contain', 'Continuous');
    cy.get('[data-cy="7-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Assessment Tool'
    );
    cy.get('[data-cy="8-description"]').should('contain', 'item 1 scores for tool2');
    cy.get('[data-cy="8-column-annotation-card-data-type"]').should('contain', 'Continuous');
    cy.get('[data-cy="8-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Assessment Tool'
    );
    cy.get('[data-cy="next-button"]').click();

    // Multi-Column Measures view
    cy.get('[data-cy="multi-column-measures-card-0"]').should('be.visible');

    cy.get('[data-cy="multi-column-measures"]').should('contain.text', '3 columns assigned');

    cy.get('[data-cy="multi-column-measures-card-0"]').should('be.visible');
    cy.get('[data-cy="mapped-column-6"]').should('be.visible').and('contain', 'tool1_item1');
    cy.get('[data-cy="mapped-column-7"]').should('be.visible').and('contain', 'tool1_item2');
    cy.get('[data-cy="multi-column-measures-card-0-header"]').should(
      'contain.text',
      'Montreal cognitive assessment'
    );

    cy.get('[data-cy="multi-column-measures-card-0"]')
      .should('contain.text', 'tool1_item1')
      .and('contain.text', 'tool1_item2');

    cy.get('[data-cy="multi-column-measures-card-1"]').should('be.visible');
    cy.get('[data-cy="mapped-column-8"]').should('be.visible').and('contain', 'tool2_item1');
    cy.get('[data-cy="multi-column-measures-card-1-header"]').should(
      'contain.text',
      'Unified Parkinsons disease rating scale'
    );
    cy.get('[data-cy="multi-column-measures-card-1"]').should('contain.text', 'tool2_item1');

    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="side-column-nav-bar-age-pheno_age"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-age-select-button"]').click();
    cy.get('[data-cy="3-continuous"]').should('be.visible');
    cy.get('[data-cy="3-format-dropdown"] input').should('have.value', 'euro');
    cy.get('[data-cy="3-continuous-table"]').should('be.visible').and('contain.text', 'NA');
    cy.get('[data-cy="3-NA-missing-value-button"]')
      .should('be.visible')
      .and('contain.text', 'Mark as not missing');

    cy.get('[data-cy="side-column-nav-bar-sex-pheno_sex"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-sex-select-button"]').click();
    cy.get('[data-cy="4-categorical"]').should('be.visible');
    cy.get('[data-cy="4-categorical-table"]').should('be.visible').and('contain.text', 'missing');
    cy.get('[data-cy="4-M-term-dropdown"] input').should('have.value', 'Male');
    cy.get('[data-cy="4-F-term-dropdown"] input').should('have.value', 'Female');
    cy.get('[data-cy="4-missing-missing-value-button"]')
      .should('be.visible')
      .and('contain.text', 'Mark as not missing');

    cy.get('[data-cy="side-column-nav-bar-diagnosis-pheno_group"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-diagnosis-select-button"]').click();
    cy.get('[data-cy="5-categorical"]').should('be.visible');
    cy.get('[data-cy="5-categorical-table"]').should('be.visible').and('contain.text', 'missing');
    cy.get('[data-cy="5-CTRL-term-dropdown"] input').should('have.value', 'Healthy Control');
    cy.get('[data-cy="5-PAT-term-dropdown"] input').should(
      'have.value',
      'Attention deficit hyperactivity disorder'
    );
    cy.get('[data-cy="5-NA-missing-value-button"]')
      .should('be.visible')
      .and('contain.text', 'Mark as not missing');

    cy.get('[data-cy="side-column-nav-bar-assessment tool-select-button"]').click();
    cy.get(
      '[data-cy="side-column-nav-bar-assessment tool-Montreal Cognitive Assessment-toggle-button"]'
    )
      .should('be.visible')
      .click();
    cy.get(
      '[data-cy="side-column-nav-bar-assessment tool-Montreal Cognitive Assessment-tool1_item1"]'
    ).should('be.visible');
    cy.get(
      '[data-cy="side-column-nav-bar-assessment tool-Montreal Cognitive Assessment-tool1_item2"]'
    ).should('be.visible');
    cy.get('[data-cy="6-tab"]').should('be.visible').and('contain.text', 'tool1_item1');
    cy.get('[data-cy="6-continuous"]').should('be.visible');
    cy.get('[data-cy="6-continuous-table"]').should('be.visible').and('contain.text', 'good');
    cy.get('[data-cy="6-missing-missing-value-button"]')
      .should('be.visible')
      .and('contain.text', 'Mark as not missing');

    cy.get('[data-cy="7-tab"]').should('be.visible').and('contain.text', 'tool1_item2').click();
    cy.get('[data-cy="7-continuous"]').should('be.visible');
    cy.get('[data-cy="7-continuous-table"]').should('be.visible').and('contain.text', 'far');
    cy.get('[data-cy="7-missing-missing-value-button"]')
      .should('be.visible')
      .and('contain.text', 'Mark as not missing');

    cy.get(
      '[data-cy="side-column-nav-bar-assessment tool-Unified Parkinsons disease rating scale score"]'
    )
      .should('be.visible')
      .click();
    cy.get(
      '[data-cy="side-column-nav-bar-assessment tool-Unified Parkinsons disease rating scale score-toggle-button"]'
    )
      .should('be.visible')
      .click();
    cy.get(
      '[data-cy="side-column-nav-bar-assessment tool-Unified Parkinsons disease rating scale score-tool2_item1"]'
    ).should('be.visible');
    cy.get('[data-cy="8-tab"]').should('be.visible').and('contain.text', 'tool2_item1');
    cy.get('[data-cy="8-continuous"]').should('be.visible');
    cy.get('[data-cy="8-continuous-table"]').should('be.visible').and('contain.text', 'hello');
    cy.get('[data-cy="8-not completed-missing-value-button"]')
      .should('be.visible')
      .and('contain.text', 'Mark as not missing');

    cy.get('[data-cy="side-column-nav-bar-other-session_id"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-other-select-button"]').click();
    cy.get('[data-cy="other"]').should('be.visible').and('contain.text', 'session_id');

    cy.get('[data-cy="next-button"]').click();

    // Download view
    cy.get('[data-cy="complete-annotations-alert"]').should('be.visible');
  });
});
