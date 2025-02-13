import Landing from '../../src/components/Landing';

describe('Landing', () => {
  it('should render correctly', () => {
    cy.mount(<Landing />);
    cy.contains('Welcome');
  });
});
