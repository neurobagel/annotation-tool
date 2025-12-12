import defaultAssessmentTerms from '../../src/assets/default_config/assessment.json';
import defaultConfig from '../../src/assets/default_config/config.json';
import defaultDiagnosisTerms from '../../src/assets/default_config/diagnosis.json';
import defaultSexTerms from '../../src/assets/default_config/sex.json';
import { mockDataTableFilePath } from '../support/testConstants';

describe('Config UI Persistence Regression', () => {
  beforeEach(() => {
    cy.intercept('GET', 'https://api.github.com/repos/neurobagel/communities/contents/configs', {
      body: [
        { type: 'dir', name: 'Neurobagel' },
        { type: 'dir', name: 'ENIGMA-PD' },
      ],
    }).as('configList');

    const configEndpoints = ['Neurobagel', 'ENIGMA-PD'];

    configEndpoints.forEach((configName) => {
      cy.intercept(
        'GET',
        `https://raw.githubusercontent.com/neurobagel/communities/main/configs/${configName}/config.json`,
        { body: defaultConfig }
      ).as(`${configName}-config`);
      cy.intercept(
        'GET',
        `https://raw.githubusercontent.com/neurobagel/communities/main/configs/${configName}/assessment.json`,
        { body: defaultAssessmentTerms }
      ).as(`${configName}-assessment`);
      cy.intercept(
        'GET',
        `https://raw.githubusercontent.com/neurobagel/communities/main/configs/${configName}/diagnosis.json`,
        { body: defaultDiagnosisTerms }
      ).as(`${configName}-diagnosis`);
      cy.intercept(
        'GET',
        `https://raw.githubusercontent.com/neurobagel/communities/main/configs/${configName}/sex.json`,
        { body: defaultSexTerms }
      ).as(`${configName}-sex`);
    });
  });

  it('should keep the user-selected config in dropdown when returning to the Upload view', () => {
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();
    cy.wait('@configList');

    // Select a non-default config
    cy.get('[data-cy="config-card-dropdown"] input').should('have.value', 'Neurobagel');
    cy.get('[data-cy="config-card-dropdown"]').type('enigma{downArrow}{enter}');
    cy.wait([
      '@ENIGMA-PD-config',
      '@ENIGMA-PD-assessment',
      '@ENIGMA-PD-diagnosis',
      '@ENIGMA-PD-sex',
    ]);
    cy.get('[data-cy="config-card-dropdown"] input').should('have.value', 'ENIGMA-PD');

    // Move forward, then back to Upload
    cy.get('[data-cy="datatable-upload-input"]').selectFile(mockDataTableFilePath, {
      force: true,
    });
    cy.get('[data-cy="next-button"]').click();
    cy.get('[data-cy="column-annotation-container"]').should('be.visible');
    cy.get('[data-cy="back-button"]').click();

    // Config choice should remain unchanged
    cy.get('[data-cy="config-card-dropdown"] input').should('have.value', 'ENIGMA-PD');
  });
});
