import Upload from '../../src/components/Upload';

const props = {
  disableConfig: false,
};

describe('Upload', () => {
  it('should render correctly', () => {
    cy.mount(<Upload disableConfig={props.disableConfig} />);
    cy.contains('Upload');
    cy.get('[data-cy="config-card"]').should('be.visible');
  });
  it('should not render ConfigCard when disableConfig is false', () => {
    cy.mount(<Upload disableConfig />);
    cy.contains('Upload');
    cy.get('[data-cy="config-card"]').should('not.exist');
  });
});
