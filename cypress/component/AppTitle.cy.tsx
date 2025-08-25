/* eslint-disable react/jsx-props-no-spreading */
import Logo from '../../src/assets/logo.svg';
import AppTitle from '../../src/components/AppTitle';

const props = {
  title: 'Neurobagel Annotation Tool',
  githubUrl: 'https://mygithub.com',
  docsUrl: 'https://mydocs.com',
};

describe('App Title', () => {
  it('renders the component without error', () => {
    cy.mount(<AppTitle {...props} />);
  });

  it('contains the correct app title text', () => {
    cy.mount(<AppTitle {...props} />);
    cy.get('[data-cy="app-title"]').should('contain.text', props.title);
  });

  it('contains our logo image', () => {
    cy.mount(<AppTitle {...props} />);
    cy.get('[data-cy="app-title"] img').should('have.attr', 'src').and('include', Logo);
  });

  it('contains external links with icons', () => {
    cy.mount(<AppTitle {...props} />);
    cy.get('[data-cy="external-links"] button').should('have.length', 2);
    cy.get('[data-cy="external-links"] button[aria-label="Documentation"]').should('exist');
    cy.get('[data-cy="external-links"] button[aria-label="GitHub Repository"]').should('exist');
    // NOTE: normally we should test here if the links are working. But because we use MUI IconButton
    // and they use a click-handler, we would instead have set up a network spy here to check if the link is called.
  });
});
