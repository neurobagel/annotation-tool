import { legacyDataTableFilePath } from '../support/testConstants';

describe('Collection Data Dictionary Regression', () => {
  beforeEach(() => {
    // Force fallback to local configs
    cy.intercept('GET', '**/api.github.com/repos/**', { forceNetworkError: true });
    cy.intercept('GET', '**/raw.githubusercontent.com/**', { forceNetworkError: true });
  });

  it('applies categorical data type and levels from a data dictionary for Assessment Tool columns', () => {
    const assessmentDataDict = {
      tool1_item1: {
        Description: 'item 1 scores for tool1',
        Levels: {
          good: { Description: 'Good score' },
          bad: { Description: 'Bad score' },
          ok: { Description: 'Okay score' },
        },
        Annotations: {
          IsAbout: {
            TermURL: 'nb:Assessment',
            Label: 'Assessment Tool',
          },
          VariableType: 'Categorical',
          IsPartOf: {
            TermURL: 'snomed:859351000000102',
            Label: 'Montreal Cognitive Assessment',
          },
          MissingValues: ['missing'],
        },
      },
      tool1_item2: {
        Description: 'item 2 scores for tool1',
        Levels: {
          far: { Description: 'Far response' },
          near: { Description: 'Near response' },
          middle: { Description: 'Middle response' },
        },
        Annotations: {
          IsAbout: {
            TermURL: 'nb:Assessment',
            Label: 'Assessment Tool',
          },
          VariableType: 'Collection',
          IsPartOf: {
            TermURL: 'snomed:859351000000102',
            Label: 'Montreal Cognitive Assessment',
          },
          MissingValues: ['missing'],
        },
      },
      tool2_item1: {
        Description: 'item 1 scores for tool2',
        Levels: {
          hello: { Description: 'Hello response' },
          world: { Description: 'World response' },
          friends: { Description: 'Friends response' },
        },
        Annotations: {
          IsAbout: {
            TermURL: 'nb:Assessment',
            Label: 'Assessment Tool',
          },
          VariableType: 'Categorical',
          IsPartOf: {
            TermURL: 'snomed:342061000000106',
            Label: 'Unified Parkinsons disease rating scale score',
          },
          MissingValues: ['not completed'],
        },
      },
    };

    cy.visit('http://localhost:5173');
    cy.get('[data-cy="next-button"]').click();

    // Upload view
    cy.get('[data-cy="datatable-upload-input"]').selectFile(legacyDataTableFilePath, {
      force: true,
    });
    cy.get('[data-cy="datadictionary-upload-input"]').selectFile(
      {
        contents: Buffer.from(JSON.stringify(assessmentDataDict)),
        fileName: 'assessment_categorical.json',
        mimeType: 'application/json',
        lastModified: Date.now(),
      },
      { force: true }
    );
    cy.get('[data-cy="datadictionary-uploaded-file-name"]').should(
      'contain',
      'assessment_categorical.json'
    );
    cy.get('[data-cy="next-button"]').click();

    // Column Annotation view should reflect categorical type from the data dictionary
    cy.get('[data-cy="5-column-annotation-card-data-type"]').should('contain', 'Categorical');
    cy.get('[data-cy="next-button"]').click();

    // Multi-column measure view
    cy.get('[data-cy="next-button"]').click();

    // Value Annotation view: Assessment Tool columns should render as categorical with level descriptions applied
    cy.get('[data-cy="side-column-nav-bar-assessment tool-select-button"]').click();
    cy.get('[data-cy="5-tab"]').click();
    cy.get('[data-cy="5-categorical"]').should('be.visible');
    cy.get('[data-cy="5-good-description"] textarea').should('have.value', 'Good score');
    cy.get('[data-cy="5-bad-description"] textarea').should('have.value', 'Bad score');
    cy.get('[data-cy="5-ok-description"] textarea').should('have.value', 'Okay score');
  });
});
