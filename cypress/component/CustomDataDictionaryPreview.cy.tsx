import CustomDataDictionaryPreview from '../../src/components/CustomDataDictionaryPreview';
import { mockFreshDataDictionaryWithAnnotations } from '../../src/utils/freshMocks';

describe('CustomDataDictionaryPreview', () => {
  beforeEach(() => {
    cy.mount(
      <CustomDataDictionaryPreview dataDictionary={mockFreshDataDictionaryWithAnnotations} />
    );
  });

  it('should render the component correctly', () => {
    cy.get('[data-cy="datadictionary-preview"]').should('exist');
    cy.get('[data-cy="expand-collapse-all-button"]').should('be.visible');
    cy.get('[data-cy="participant_id-key"]').should('contain', 'participant_id');
    cy.get('[data-cy="age-key"]').should('contain', 'age');
    cy.get('[data-cy="sex-key"]').should('contain', 'sex');
  });
  it('should expand, verify the content, and collapse nested sections', () => {
    cy.get('[data-cy="age-expand-collapse-button"]').click();
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
