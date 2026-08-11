import ErrorBoundary from '../../src/components/ErrorBoundary';

const ErrorThrowingComponent: React.FC = function ErrorThrowingComponent() {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  it('should display fallback UI when an error is thrown', () => {
    cy.mount(
      <ErrorBoundary>
        <ErrorThrowingComponent />
      </ErrorBoundary>
    );

    cy.get('img[alt="errorboundary-emoji"]').should('be.visible');
    cy.get('[data-cy="error-message"]').should('be.visible');
    cy.get('[data-cy="toggle-details-button"]').should('be.visible');
    cy.get('[data-cy="reload-page-button"]').should('be.visible');

    cy.get('[data-cy="toggle-details-button"]').click();

    cy.get('[data-cy="error-text"]').should('contain.text', 'Error: Test error').and('be.visible');
    cy.get('[data-cy="component-stack"]')
      .should('contain.text', 'at ErrorThrowingComponent')
      .and('be.visible');
  });
});
