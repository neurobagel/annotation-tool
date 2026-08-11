import App from '~/App';

describe('<App />', () => {
  it('renders', () => {
    // see: https://docs.cypress.io/app/component-testing/react/examples
    cy.mount(<App />);
  });
});
