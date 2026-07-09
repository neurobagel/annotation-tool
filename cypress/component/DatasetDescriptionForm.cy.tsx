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
    cy.get('[data-cy="dataset-name-input"] input').should('have.value', '');
    cy.get('[data-cy="dataset-name-input"]').contains('Name is required');

    cy.get('[data-cy="dataset-name-input"] input').type('Test Dataset');
    cy.get('[data-cy="dataset-name-input"]').should('not.contain', 'Name is required');

    cy.get('[data-cy="dataset-name-input"] input').clear();
    cy.get('[data-cy="dataset-name-input"] input').type('   ');
    cy.get('[data-cy="dataset-name-input"]').contains('Name is required');
  });

  it('validates the RepositoryURL and AccessLink fields', () => {
    const invalidUrl = 'invalid-url';
    const validUrl = 'https://example.com';

    cy.get('[data-cy="dataset-repo-input"] input').type(invalidUrl);
    cy.get('[data-cy="dataset-repo-input"]').contains('Must be a valid HTTP/HTTPS URL');
    cy.get('[data-cy="dataset-repo-input"] input').clear();
    cy.get('[data-cy="dataset-repo-input"] input').type(validUrl);
    cy.get('[data-cy="dataset-repo-input"]').should(
      'not.contain',
      'Must be a valid HTTP/HTTPS URL'
    );

    cy.get('[data-cy="dataset-accesslink-input"] input').type(invalidUrl);
    cy.get('[data-cy="dataset-accesslink-input"]').contains('Must be a valid HTTP/HTTPS URL');
    cy.get('[data-cy="dataset-accesslink-input"] input').clear();
    cy.get('[data-cy="dataset-accesslink-input"] input').type(validUrl);
    cy.get('[data-cy="dataset-accesslink-input"]').should(
      'not.contain',
      'Must be a valid HTTP/HTTPS URL'
    );
  });

  it('validates the AccessEmail field', () => {
    const invalidEmail = 'invalid-email';
    const validEmail = 'test@example.com';

    cy.get('[data-cy="dataset-accessemail-input"] input').type(invalidEmail);
    cy.get('[data-cy="dataset-accessemail-input"]').contains('Must be a valid email address');

    cy.get('[data-cy="dataset-accessemail-input"] input').clear();
    cy.get('[data-cy="dataset-accessemail-input"] input').type(validEmail);
    cy.get('[data-cy="dataset-accessemail-input"]').should(
      'not.contain',
      'Must be a valid email address'
    );
  });

  it('handles repeatable array fields', () => {
    // Authors
    cy.get('[data-cy="dataset-authors-input-0"] input').type('Author One');
    cy.get('[data-cy="dataset-authors-add"]').click();
    cy.get('[data-cy="dataset-authors-input-1"] input').type('Author Two');
    cy.get('[data-cy="dataset-authors-input-0"] input').should('have.value', 'Author One');
    cy.get('[data-cy="dataset-authors-input-1"] input').should('have.value', 'Author Two');
    cy.get('[data-cy="authors-preview"]').should('contain.text', '["Author One", "Author Two"]');

    cy.get('[data-cy="dataset-authors-remove-0"]').click();
    cy.get('[data-cy="dataset-authors-input-0"] input').should('have.value', 'Author Two');
    cy.get('[data-cy="dataset-authors-input-1"]').should('not.exist');
    cy.get('[data-cy="authors-preview"]').should('contain.text', '["Author Two"]');

    // References
    cy.contains('Reference info').click();
    cy.get('[data-cy="dataset-references-input-0"] input').type('http://paper.com');
    cy.get('[data-cy="dataset-references-add"]').click();
    cy.get('[data-cy="dataset-references-input-1"] input').type('http://repo.com');
    cy.get('[data-cy="dataset-references-input-0"] input').should('have.value', 'http://paper.com');
    cy.get('[data-cy="dataset-references-input-1"] input').should('have.value', 'http://repo.com');
    cy.get('[data-cy="references-preview"]').should(
      'contain.text',
      '["http://paper.com", "http://repo.com"]'
    );

    // Keywords
    cy.get('[data-cy="dataset-keywords-input-0"] input').type('fmri');
    cy.get('[data-cy="dataset-keywords-add"]').click();
    cy.get('[data-cy="dataset-keywords-input-1"] input').type('neuroimaging');
    cy.get('[data-cy="dataset-keywords-input-0"] input').should('have.value', 'fmri');
    cy.get('[data-cy="dataset-keywords-input-1"] input').should('have.value', 'neuroimaging');
    cy.get('[data-cy="keywords-preview"]').should('contain.text', '["fmri", "neuroimaging"]');
  });
});
