import defaultConfig from '../../src/assets/default_config/config.json';
import defaultDiagnosisTerms from '../../src/assets/default_config/diagnosis.json';
import defaultSexTerms from '../../src/assets/default_config/sex.json';
import { mockDataTableFilePath } from '../support/testConstants';

const oldAssessmentTerms = [
  {
    namespace_prefix: 'neurobagel',
    namespace_url: 'https://old.com/asse/terms/',
    vocabulary_name: 'Neurobagel Assessments',
    version: '1.0.0',
    terms: [{ id: 'old_id', name: 'Old Name' }],
  },
];

const newConfig = {
  ...defaultConfig[0],
  vocabulary_name: 'New Vocab',
  namespace_prefix: 'new',
};

const newAssessmentTerms = [
  {
    namespace_prefix: 'new',
    namespace_url: 'https://new.org/pd/terms/',
    vocabulary_name: 'new Assessments',
    version: '1.0.0',
    terms: [
      { id: 'new_id', name: 'New Name' },
      { id: 'another_id', name: 'Another Name' },
    ],
  },
];

describe('Config Change Regression', () => {
  beforeEach(() => {
    // Serve two remote configs so we can swap from Neurobagel to New mid-flow
    cy.intercept('GET', 'https://api.github.com/repos/neurobagel/communities/contents/configs', {
      body: [
        { type: 'dir', name: 'Neurobagel' },
        { type: 'dir', name: 'New' },
      ],
    }).as('configList');

    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/Neurobagel/config.json',
      {
        body: defaultConfig,
      }
    ).as('nbConfig');
    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/Neurobagel/assessment.json',
      { body: oldAssessmentTerms }
    ).as('nbAssessment');
    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/Neurobagel/diagnosis.json',
      { body: defaultDiagnosisTerms }
    ).as('nbDiagnosis');
    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/Neurobagel/sex.json',
      { body: defaultSexTerms }
    ).as('nbSex');

    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/New/config.json',
      { body: [newConfig] }
    ).as('newConfig');
    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/New/assessment.json',
      { body: newAssessmentTerms }
    ).as('newAssessment');
    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/New/diagnosis.json',
      { body: defaultDiagnosisTerms }
    ).as('newDiagnosis');
    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/New/sex.json',
      { body: defaultSexTerms }
    ).as('newSex');
  });

  it('Should update assessment vocabulary after changing configs', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Upload view - Select Neurobagel config
    cy.wait('@configList');
    cy.get('[data-cy="config-card-dropdown"] input').should('have.value', 'Neurobagel');
    cy.get('[data-config-loading="false"]').should('exist');

    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockDataTableFilePath, {
      force: true,
    });
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view - Annotate a column as Assessment Tool with the default Neurobagel config
    cy.get('[data-cy="column-annotation-container"]').should('be.visible');
    cy.get('[data-cy="4-column-annotation-card-standardized-variable-dropdown"]').type(
      'assessment{downArrow}{enter}'
    );
    cy.get('[data-cy="next-button"]').click();

    // Multi-Column Measures view - Move to Multi-Column Measures, then backtrack to the Upload view to change configs
    cy.get('[data-cy="multi-column-measures-tab-Assessment Tool"]').should('be.visible');
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-0-title-dropdown"]').click();
    cy.get('ul[role="listbox"]').should('contain', 'Old Name');
    cy.get('[data-cy="back-button"]').click();
    cy.get('[data-cy="back-button"]').click();

    // Upload view - Change to "New" config and wait for its vocab to load
    cy.get('[data-cy="config-card-dropdown"]').type('new{downArrow}{enter}');
    cy.wait(['@newConfig', '@newAssessment', '@newDiagnosis', '@newSex']);

    // Re-run annotation using the new config to ensure we see the refreshed vocab
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="column-annotation-container"]').should('be.visible');
    cy.get('[data-cy="4-column-annotation-card-standardized-variable-dropdown"]').type(
      'Assessment{downArrow}{enter}'
    );
    cy.get('[data-cy="next-button"]').click();

    // New assessment terms from "New" should replace the Neurobagel list
    cy.get('[data-cy="multi-column-measures-tab-Assessment Tool"]').should('be.visible');
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-0-title-dropdown"]').click();
    cy.get('ul[role="listbox"]').should('contain', 'New Name');
    cy.get('ul[role="listbox"]').should('not.contain', 'Old Name');
  });
});
