import Landing from '../../src/components/Landing';

describe('Landing', () => {
  it('renders the component correctly', () => {
    cy.mount(<Landing />);
    cy.contains('Welcome to the Neurobagel Annotation Tool');
    cy.get('img[alt="Neurobagel Logo"]').should('be.visible');
    cy.get('img[alt="Neurobagel Logo"]').should('have.attr', 'alt', 'Neurobagel Logo');
    cy.get('img[alt="Landing emoji"]').should('be.visible');
    cy.get('img[alt="Landing emoji"]').should('have.attr', 'alt', 'Landing emoji');
    cy.get('[data-cy="next-button"]').should('be.visible').and('contain', 'Get Started');
  });
});
