import ConfigCard from '../../src/components/ConfigCard';

const props = {
  title: 'Configuration',
  options: ['Neurobagel', 'some config', 'another config'],
  value: 'Neurobagel',
  onChange: () => {},
};

describe('ConfigCard', () => {
  it('should render the component correctly', () => {
    cy.mount(
      <ConfigCard
        title={props.title}
        options={props.options}
        value={props.value}
        onChange={props.onChange}
      />
    );
    cy.get('[data-cy="config-card"]').should('be.visible').and('contain', props.title);
    cy.get('[data-cy="config-card-dropdown"]').should('be.visible');
    cy.get('[data-cy="config-card-dropdown"] input').should('have.value', 'Neurobagel');
    cy.get('[data-cy="config-card-dropdown"]').click();
    cy.get('ul[role="listbox"]').within(() => {
      cy.contains('Neurobagel').should('be.visible');
      cy.contains('some config').should('be.visible');
      cy.contains('another config').should('be.visible');
    });
  });
  it('should fire onChange event handler with the appropriate payload when the config is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ConfigCard title={props.title} options={props.options} value={props.value} onChange={spy} />
    );
    cy.get('[data-cy="config-card-dropdown"]').type('some con{downarrow}{enter}');
    cy.get('@spy').should('have.been.calledWith', 'some config');
  });
});
