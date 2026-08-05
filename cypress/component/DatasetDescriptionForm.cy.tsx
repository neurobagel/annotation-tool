import DatasetDescriptionForm from '../../src/components/DatasetDescriptionForm';
import { useDataStore } from '../../src/stores/data';

describe('DatasetDescriptionForm', () => {
  beforeEach(() => {
    useDataStore.getState().actions.reset();
    cy.mount(<DatasetDescriptionForm />);
  });

  it('should render the form correctly', () => {
    cy.get('[data-cy="dataset-description-form"]').should('exist');
    cy.get('[data-cy="dataset-name-input"]').should('exist');
  });

  it('should validate the Name field', () => {
    cy.get('[data-cy="dataset-name-input"] input').should('have.value', '');
    cy.get('[data-cy="dataset-name-input"]').contains('Name is required');

    cy.get('[data-cy="dataset-name-input"] input').type('Test Dataset');
    cy.get('[data-cy="dataset-name-input"]').should('not.contain', 'Name is required');

    cy.get('[data-cy="dataset-name-input"] input').clear();
    cy.get('[data-cy="dataset-name-input"] input').type('   ');
    cy.get('[data-cy="dataset-name-input"]').contains('Name is required');
  });

  it('should validate the RepositoryURL and AccessLink fields', () => {
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

  it('should validate the AccessEmail field', () => {
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

  it('should fire the userUpdatesDatasetDescription action with the appropriate payload when the Authors field is updated', () => {
    cy.window().then(() => {
      cy.spy(useDataStore.getState().actions, 'userUpdatesDatasetDescription').as('updateAction');
    });

    cy.get('[data-cy="dataset-authors-input-0"] input').type('Author One');
    cy.get('[data-cy="authors-preview"]').should('contain.text', '["Author One"]');
    cy.get('@updateAction').should('have.been.calledWith', 'Authors', ['Author One']);
  });

  it('should fire the userUpdatesDatasetDescription action with the appropriate payload when the References field is updated', () => {
    cy.window().then(() => {
      cy.spy(useDataStore.getState().actions, 'userUpdatesDatasetDescription').as('updateAction');
    });

    cy.get('[data-cy="reference-info-accordion"]').click();
    cy.get('[data-cy="dataset-references-input-0"] input').type('https://example.com/paper');
    cy.get('[data-cy="references-preview"]').should(
      'contain.text',
      '["https://example.com/paper"]'
    );
    cy.get('@updateAction').should('have.been.calledWith', 'ReferencesAndLinks', [
      'https://example.com/paper',
    ]);
  });

  it('should fire the userUpdatesDatasetDescription action with the appropriate payload when the Keywords field is updated', () => {
    cy.window().then(() => {
      cy.spy(useDataStore.getState().actions, 'userUpdatesDatasetDescription').as('updateAction');
    });

    cy.get('[data-cy="reference-info-accordion"]').click();
    cy.get('[data-cy="dataset-keywords-input-0"] input').type('fmri');
    cy.get('[data-cy="keywords-preview"]').should('contain.text', '["fmri"]');
    cy.get('@updateAction').should('have.been.calledWith', 'Keywords', ['fmri', '', '', '', '']);
  });
});
