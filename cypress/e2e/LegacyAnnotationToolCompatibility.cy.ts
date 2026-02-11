import { legacyDataTableFilePath, legacyDataDictionaryFilePath } from '../support/testConstants';

describe('Legacy Annotation Tool Compatibility', () => {
  beforeEach(() => {
    // Mock failed GitHub API requests to force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });

  it('should upload a data dictionary from the legacy annotation tool', () => {
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
    cy.get('[data-cy="0-description"]').should('contain', 'A participant ID');
    cy.get('[data-cy="0-column-annotation-card-data-type"]').should('contain', 'Identifier');
    cy.get('[data-cy="0-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Participant ID'
    );
    cy.get('[data-cy="1-description"]').should('contain', 'A session ID');
    cy.get('[data-cy="2-description"]').should('contain', 'Age of the participant');
    cy.get('[data-cy="2-column-annotation-card-data-type"]').should('contain', 'Cont');
    cy.get('[data-cy="2-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Age'
    );
    // Scroll to access the 4th column annotation card
    cy.get('[data-cy="3-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="3-description"]').should('contain', 'Sex');
    cy.get('[data-cy="3-column-annotation-card-data-type"]').should('contain', 'Categorical');
    cy.get('[data-cy="3-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Sex'
    );
    cy.get('[data-cy="4-description"]').should('contain', 'Group variable');
    cy.get('[data-cy="4-column-annotation-card-data-type"]').should('contain', 'Categorical');
    cy.get('[data-cy="4-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Diagnosis'
    );
    cy.get('[data-cy="5-description"]').should('contain', 'item 1 scores for tool1');
    cy.get('[data-cy="5-column-annotation-card-data-type"]').should('contain', 'Cont');
    cy.get('[data-cy="5-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Assessment Tool'
    );
    // Scroll to access the 7th and 8th column annotation cards
    cy.get('[data-cy="6-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="6-description"]').should('contain', 'item 2 scores for tool1');
    cy.get('[data-cy="6-column-annotation-card-data-type"]').should('contain', 'Cont');
    cy.get('[data-cy="6-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Assessment Tool'
    );
    cy.get('[data-cy="7-description"]').should('contain', 'item 1 scores for tool2');
    cy.get('[data-cy="7-column-annotation-card-data-type"]').should('contain', 'Cont');
    cy.get('[data-cy="7-column-annotation-card-standardized-variable-dropdown"] input').should(
      'have.value',
      'Assessment Tool'
    );
    cy.get('[data-cy="next-button"]').click();

    // Multi-Column Measures view
    cy.get('[data-cy="multi-column-measures-card-0"]').should('be.visible');

    cy.get('[data-cy="multi-column-measures"]').should('contain.text', '3 columns assigned');

    cy.get('[data-cy="multi-column-measures-card-0"]').should('be.visible');
    cy.get('[data-cy="mapped-column-5"]').should('be.visible').and('contain', 'tool1_item1');
    cy.get('[data-cy="mapped-column-6"]').should('be.visible').and('contain', 'tool1_item2');
    cy.get('[data-cy="multi-column-measures-card-0-header"]').should(
      'contain.text',
      'Montreal cognitive assessment'
    );

    cy.get('[data-cy="multi-column-measures-card-0"]')
      .should('contain.text', 'tool1_item1')
      .and('contain.text', 'tool1_item2');

    cy.get('[data-cy="multi-column-measures-card-1"]').should('be.visible');
    cy.get('[data-cy="mapped-column-7"]').should('be.visible').and('contain', 'tool2_item1');
    cy.get('[data-cy="multi-column-measures-card-1-header"]').should(
      'contain.text',
      'Unified Parkinsons disease rating scale'
    );
    cy.get('[data-cy="multi-column-measures-card-1"]').should('contain.text', 'tool2_item1');

    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view
    cy.get('[data-cy="side-column-nav-bar-age-pheno_age"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-age-select-button"]').click();
    cy.get('[data-cy="2-continuous"]').should('be.visible');
    cy.get('[data-cy="2-format-dropdown"] input').should('have.value', 'euro');
    cy.get('[data-cy="2-continuous-table"]').should('be.visible').and('contain.text', 'NA');
    cy.get('[data-cy="2-sort-status-button"]').click();
    cy.get('[data-cy="2-NA-missing-value-yes"]').should('have.class', 'Mui-selected');

    cy.get('[data-cy="side-column-nav-bar-sex-pheno_sex"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-sex-select-button"]').click();
    cy.get('[data-cy="3-categorical"]').should('be.visible');
    cy.get('[data-cy="3-categorical-table"]').should('be.visible').and('contain.text', 'missing');
    cy.get('[data-cy="3-M-term-dropdown"] input').should('have.value', 'Male');
    cy.get('[data-cy="3-F-term-dropdown"] input').should('have.value', 'Female');
    cy.get('[data-cy="3-missing-missing-value-yes"]').should('have.class', 'Mui-selected');

    cy.get('[data-cy="side-column-nav-bar-diagnosis-pheno_group"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-diagnosis-select-button"]').click();
    cy.get('[data-cy="4-categorical"]').should('be.visible');
    cy.get('[data-cy="4-categorical-table"]').should('be.visible').and('contain.text', 'missing');
    cy.get('[data-cy="4-PAT-term-dropdown"] input').should(
      'have.value',
      'Attention deficit hyperactivity disorder'
    );
    cy.get('[data-cy="4-NA-missing-value-yes"]').should('have.class', 'Mui-selected');

    cy.get('[data-cy="side-column-nav-bar-assessment tool-select-button"]').click();
    cy.get(
      '[data-cy="side-column-nav-bar-assessment tool-Montreal cognitive assessment-toggle-button"]'
    )
      .should('be.visible')
      .click();
    cy.get(
      '[data-cy="side-column-nav-bar-assessment tool-Montreal cognitive assessment-tool1_item1"]'
    ).should('be.visible');
    cy.get(
      '[data-cy="side-column-nav-bar-assessment tool-Montreal cognitive assessment-tool1_item2"]'
    ).should('be.visible');
    cy.get('[data-cy="5-tab"]').should('be.visible').and('contain.text', 'tool1_item1');
    cy.get('[data-cy="5-continuous"]').should('be.visible');
    cy.get('[data-cy="5-continuous-table"]').should('be.visible').and('contain.text', 'good');
    cy.get('[data-cy="5-missing-missing-value-yes"]').should('have.class', 'Mui-selected');

    cy.get('[data-cy="6-tab"]').should('be.visible').and('contain.text', 'tool1_item2').click();
    cy.get('[data-cy="6-continuous"]').should('be.visible');
    cy.get('[data-cy="6-continuous-table"]').should('be.visible').and('contain.text', 'far');
    cy.get('[data-cy="6-missing-missing-value-yes"]').should('have.class', 'Mui-selected');

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
    cy.get('[data-cy="7-tab"]').should('be.visible').and('contain.text', 'tool2_item1');
    cy.get('[data-cy="7-continuous"]').should('be.visible');
    cy.get('[data-cy="7-continuous-table"]').should('be.visible').and('contain.text', 'hello');
    cy.get('[data-cy="7-not completed-missing-value-yes"]').should('have.class', 'Mui-selected');

    cy.get('[data-cy="side-column-nav-bar-unannotated"]').click();
    cy.get('[data-cy="side-column-nav-bar-other-session_id"]').should('exist');
    cy.get('[data-cy="side-column-nav-bar-other-select-button"]').click();
    cy.get('[data-cy="other"]').should('be.visible').and('contain.text', 'session_id');

    cy.get('[data-cy="next-button"]').click();

    // Download view
    cy.get('[data-cy="complete-annotations-alert"]').should('be.visible');
  });
});
