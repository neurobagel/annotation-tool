import { MyButton } from '~/components/MyButton';

describe('My Button', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<MyButton />);
  });

  it('counts', () => {
    cy.mount(<MyButton />);
    cy.contains('count').should('contain', '0');
    cy.contains('count').click();
    cy.contains('count').should('contain', '1');
  });
});
