import DatasetDescriptionForm from '../../src/components/DatasetDescriptionForm';
import { useDataStore } from '../../src/stores/data';

describe('DatasetDescriptionForm', () => {
  beforeEach(() => {
    useDataStore.getState().actions.reset();
    cy.mount(<DatasetDescriptionForm />);
  });

  it('renders the form correctly', () => {
    cy.get('[data-cy="dataset-description-form"]').should('exist');
    cy.get('[data-cy="dataset-name-input"]').should('exist');
  });

  it('validates the Name field', () => {
    cy.get('[data-cy="dataset-name-input"]').find('input').should('have.value', '');
    cy.get('[data-cy="dataset-name-input"]').contains('Name is required');

    cy.get('[data-cy="dataset-name-input"]').find('input').type('Test Dataset');
    cy.get('[data-cy="dataset-name-input"]').should('not.contain', 'Name is required');

    cy.get('[data-cy="dataset-name-input"]').find('input').clear();
    cy.get('[data-cy="dataset-name-input"]').find('input').type('   ');
    cy.get('[data-cy="dataset-name-input"]').contains('Name is required');
  });

  it('validates the RepositoryURL and AccessLink fields', () => {
    const invalidUrl = 'invalid-url';
    const validUrl = 'https://example.com';

    cy.get('[data-cy="dataset-repo-input"]').find('input').type(invalidUrl);
    cy.get('[data-cy="dataset-repo-input"]').contains('Must be a valid HTTP/HTTPS URL');
    cy.get('[data-cy="dataset-repo-input"]').find('input').clear();
    cy.get('[data-cy="dataset-repo-input"]').find('input').type(validUrl);
    cy.get('[data-cy="dataset-repo-input"]').should(
      'not.contain',
      'Must be a valid HTTP/HTTPS URL'
    );

    cy.get('[data-cy="dataset-accesslink-input"]').find('input').type(invalidUrl);
    cy.get('[data-cy="dataset-accesslink-input"]').contains('Must be a valid HTTP/HTTPS URL');
    cy.get('[data-cy="dataset-accesslink-input"]').find('input').clear();
    cy.get('[data-cy="dataset-accesslink-input"]').find('input').type(validUrl);
    cy.get('[data-cy="dataset-accesslink-input"]').should(
      'not.contain',
      'Must be a valid HTTP/HTTPS URL'
    );
  });

  it('validates the AccessEmail field', () => {
    const invalidEmail = 'invalid-email';
    const validEmail = 'test@example.com';

    cy.get('[data-cy="dataset-accessemail-input"]').find('input').type(invalidEmail);
    cy.get('[data-cy="dataset-accessemail-input"]').contains('Must be a valid email address');

    cy.get('[data-cy="dataset-accessemail-input"]').find('input').clear();
    cy.get('[data-cy="dataset-accessemail-input"]').find('input').type(validEmail);
    cy.get('[data-cy="dataset-accessemail-input"]').should(
      'not.contain',
      'Must be a valid email address'
    );
  });

  it('handles comma-separated array fields and toggles previews', () => {
    cy.get('[data-cy="dataset-authors-input"]').find('input').type('Author One, Author Two');
    cy.get('[data-cy="authors-preview"]').should('contain.text', '["Author One", "Author Two"]');

    cy.get('[data-cy="authors-preview-toggle"]').click();
    cy.get('[data-cy="authors-preview"]').should('not.exist');

    cy.get('[data-cy="authors-preview-toggle"]').click();
    cy.get('[data-cy="authors-preview"]').should('exist');

    cy.contains('Reference info').click();
    cy.get('[data-cy="dataset-references-input"]')
      .find('input')
      .type('http://paper.com,  http://repo.com ');
    cy.get('[data-cy="references-preview"]').should(
      'contain.text',
      '["http://paper.com", "http://repo.com"]'
    );

    cy.get('[data-cy="dataset-keywords-input"]').find('input').type('fmri , neuroimaging');
    cy.get('[data-cy="keywords-preview"]').should('contain.text', '["fmri", "neuroimaging"]');
  });
});
