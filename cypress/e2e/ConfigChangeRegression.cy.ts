import defaultAssessmentTerms from '../../src/assets/default_config/assessment.json';
import defaultConfig from '../../src/assets/default_config/config.json';
import defaultDiagnosisTerms from '../../src/assets/default_config/diagnosis.json';
import defaultSexTerms from '../../src/assets/default_config/sex.json';
import { mockDataTableFilePath } from '../support/testConstants';

const coolConfig = {
  ...defaultConfig[0],
  vocabulary_name: 'Cool Vocab',
  namespace_prefix: 'cool',
};

const coolAssessmentTerms = [
  {
    namespace_prefix: 'cool',
    namespace_url: 'https://cool.org/pd/terms/',
    vocabulary_name: 'cool Assessments',
    version: '1.0.0',
    terms: [
      { id: 'cool_id', name: 'Cool Name' },
      { id: 'another_id', name: 'Another Name' },
    ],
  },
];

describe('Config Change Regression', () => {
  beforeEach(() => {
    // Serve two remote configs so we can swap from Neurobagel to Cool mid-flow
    cy.intercept('GET', 'https://api.github.com/repos/neurobagel/communities/contents/configs', {
      body: [
        { type: 'dir', name: 'Neurobagel' },
        { type: 'dir', name: 'Cool' },
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
      { body: defaultAssessmentTerms }
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
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/Cool/config.json',
      { body: [coolConfig] }
    ).as('coolConfig');
    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/Cool/assessment.json',
      { body: coolAssessmentTerms }
    ).as('coolAssessment');
    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/Cool/diagnosis.json',
      { body: defaultDiagnosisTerms }
    ).as('coolDiagnosis');
    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/Cool/sex.json',
      { body: defaultSexTerms }
    ).as('coolSex');
  });

  it('Should update assessment vocabulary after changing configs', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Upload view - Select Neurobagel config
    cy.wait('@configList');
    cy.get('[data-cy="config-card-dropdown"] input').should('have.value', 'Neurobagel');
    cy.get('[data-config-loading="false"] ').should('exist');

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
    cy.get('ul[role="listbox"]').should('contain', 'Robson Ten Group Classification System');
    cy.get('[data-cy="back-button"]').click();
    cy.get('[data-cy="back-button"]').click();

    // Upload view - Change to "Cool" config and wait for its vocab to load
    cy.get('[data-cy="config-card-dropdown"]').type('cool{downArrow}{enter}');
    cy.wait(['@coolConfig', '@coolAssessment', '@coolDiagnosis', '@coolSex']);

    // Re-run annotation using the new config to ensure we see the refreshed vocab
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="column-annotation-container"]').should('be.visible');
    cy.get('[data-cy="4-column-annotation-card-standardized-variable-dropdown"]').type(
      'Assessment{downArrow}{enter}'
    );
    cy.get('[data-cy="next-button"]').click();

    // New assessment terms from "Cool" should replace the Neurobagel list
    cy.get('[data-cy="multi-column-measures-tab-Assessment Tool"]').should('be.visible');
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-0-title-dropdown"]').click();
    cy.get('ul[role="listbox"]').should('contain', 'Cool Name');
    cy.get('ul[role="listbox"]').should('not.contain', 'Robson Ten Group Classification System');
  });
});
