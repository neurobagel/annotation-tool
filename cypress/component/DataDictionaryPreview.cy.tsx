import DataDictionaryPreview from '../../src/components/DataDictionaryPreview';
import { mockDataDictionary } from '../../src/utils/mocks';

describe('DataDictionaryPreview', () => {
  beforeEach(() => {
    cy.mount(<DataDictionaryPreview dataDictionary={mockDataDictionary} />);
  });

  it('should render the component correctly', () => {
    cy.get('[data-cy="data-dictionary-preview"]').should('exist');
    cy.get('[data-cy="expand-collapse-all-button"]').should('be.visible');
    cy.get('[data-cy="participant_id-key"]').should('contain', 'participant_id');
    cy.get('[data-cy="pheno_age-key"]').should('contain', 'pheno_age');
    cy.get('[data-cy="pheno_sex-key"]').should('contain', 'pheno_sex');
  });

  it('should expand, verify the content, and collapse all top-level sections', () => {
    cy.get('[data-cy="expand-collapse-all-button"]').click();
    cy.get('[data-cy="participant_id-Description-nested-key"]').should('be.visible');
    cy.get('[data-cy="participant_id-Annotations-nested-key"]').should('be.visible');
    cy.get('[data-cy="pheno_age-Description-nested-key"]').should('be.visible');
    cy.get('[data-cy="pheno_age-Annotations-nested-key"]').should('be.visible');
    cy.get('[data-cy="pheno_sex-Description-nested-key"]').should('be.visible');
    cy.get('[data-cy="pheno_sex-Annotations-nested-key"]').should('be.visible');
    cy.get('[data-cy="expand-collapse-all-button"]').click();
    cy.get('[data-cy="participant_id-Description-nested-key"]').should('not.be.visible');
    cy.get('[data-cy="participant_id-Annotations-nested-key"]').should('not.be.visible');
    cy.get('[data-cy="pheno_age-Description-nested-key"]').should('not.be.visible');
    cy.get('[data-cy="pheno_age-Annotations-nested-key"]').should('not.be.visible');
    cy.get('[data-cy="pheno_sex-Description-nested-key"]').should('not.be.visible');
    cy.get('[data-cy="pheno_sex-Annotations-nested-key"]').should('not.be.visible');
  });

  it('should expand, verify the content, and collapse nested sections', () => {
    cy.get('[data-cy="pheno_age-expand-collapse-button"]').click();
    cy.get('[data-cy="Description-value"]').should('contain', 'Age of the participant');
    cy.get('[data-cy="Annotations-expand-collapse-button"]').click();
    cy.get('[data-cy="Annotations-IsAbout-nested-key"]').should('be.visible');
    cy.get('[data-cy="IsAbout-expand-collapse-button"]').click();
    cy.get('[data-cy="IsAbout-TermURL-nested-key"]').should('be.visible');
    cy.get('[data-cy="TermURL-value"]').should('contain', 'nb:Age');
    cy.get('[data-cy="IsAbout-Label-nested-key"]').should('be.visible');
    cy.get('[data-cy="Label-value"]').should('contain', 'Age');
    cy.get('[data-cy="IsAbout-expand-collapse-button"]').click();
    cy.get('[data-cy="IsAbout-TermURL-nested-key"]').should('not.be.visible');
    cy.get('[data-cy="IsAbout-Label-nested-key"]').should('not.be.visible');
  });
});
