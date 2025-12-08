import defaultAssessmentTerms from '../../src/assets/default_config/assessment.json';
import defaultConfig from '../../src/assets/default_config/config.json';
import { mockDataTableFilePath } from '../support/testConstants';

const paddedAssessmentTerms = JSON.parse(JSON.stringify(defaultAssessmentTerms));
paddedAssessmentTerms[0].terms = [
  ...paddedAssessmentTerms[0].terms,
  { id: 'somterm', name: 'Side of onset' },
  { id: 'anotherterm', name: 'Side of onset' },
];

describe('Duplicate Assessment Options Regression', () => {
  beforeEach(() => {
    // Serve a config with duplicate assessment labels using the default Neurobagel config.
    cy.intercept('GET', 'https://api.github.com/repos/neurobagel/communities/contents/configs', {
      body: [{ type: 'dir', name: 'Neurobagel' }],
    }).as('configList');

    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/Neurobagel/config.json',
      {
        body: defaultConfig,
      }
    ).as('configJson');

    cy.intercept(
      'GET',
      'https://raw.githubusercontent.com/neurobagel/communities/main/configs/Neurobagel/assessment.json',
      {
        body: paddedAssessmentTerms,
      }
    ).as('assessmentTerms');
  });

  it('shows each duplicate assessment term exactly once in the dropdown', () => {
    cy.visit('http://localhost:5173');

    // Move to Upload and select the mocked config.
    cy.get('[data-cy="next-button"]').click();
    cy.wait('@configList');
    cy.get('[data-cy="config-card-dropdown"]').click();
    cy.get('ul[role="listbox"] [role="option"]').contains('Neurobagel').click();
    cy.wait(['@configJson', '@assessmentTerms']);

    // Upload a table and proceed.
    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockDataTableFilePath, {
      force: true,
    });
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view
    cy.get('[data-cy="0-column-annotation-card-standardized-variable-dropdown"]').click();
    cy.get('ul[role="listbox"] [role="option"]').contains('Assessment Tool').click();
    cy.get('[data-cy="next-button"]').click();

    // Multi-Column Measures view
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-0-title-dropdown"]').click();
    cy.get('[data-cy="multi-column-measures-card-0-title-dropdown"]').type('onset');

    cy.get('ul[role="listbox"]')
      .find('.MuiAutocomplete-option')
      .filter((_, el) => el.textContent?.includes('Side of onset'))
      .should('have.length', 2);
  });
});
