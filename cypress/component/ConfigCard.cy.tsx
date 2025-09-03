import ConfigCard from '../../src/components/ConfigCard';

const props = {
  title: 'Configuration',
  disableDropdown: false,
  options: ['Neurobagel', 'some config', 'another config'],
  value: 'Neurobagel',
  onChange: () => {},
  isLoading: false,
};

describe('ConfigCard', () => {
  it('should render the component correctly', () => {
    cy.mount(
      <ConfigCard
        title={props.title}
        disableDropdown={props.disableDropdown}
        options={props.options}
        value={props.value}
        onChange={props.onChange}
        isLoading={props.isLoading}
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
      <ConfigCard
        title={props.title}
        disableDropdown={props.disableDropdown}
        options={props.options}
        value={props.value}
        onChange={spy}
        isLoading={props.isLoading}
      />
    );
    cy.get('[data-cy="config-card-dropdown"]').type('some con{downarrow}{enter}');
    cy.get('@spy').should('have.been.calledWith', 'some config');
  });
  it('should disable the dropdown when the disableDropdown prop is true', () => {
    cy.mount(
      <ConfigCard
        title={props.title}
        disableDropdown
        options={props.options}
        value={props.value}
        onChange={props.onChange}
        isLoading={props.isLoading}
      />
    );
    cy.get('[data-cy="config-card-dropdown"] input').should('be.disabled');
  });
});
