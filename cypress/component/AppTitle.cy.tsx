import AppTitle from '../../src/components/AppTitle';

describe('App Title', () => {
  it('renders the component correctly', () => {
    cy.mount(<AppTitle />);
    cy.get('h1').should('contain', 'Title');
  });
});
