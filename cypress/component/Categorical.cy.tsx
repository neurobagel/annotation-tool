import Categorical from '../../src/components/Categorical';

const props = {
  columnID: '3',
  uniqueValues: ['F', 'M', 'N/A', 'Missing'],
  levels: {
    F: { description: 'Female', standardizedTerm: undefined },
    M: { description: 'Male', standardizedTerm: undefined },
  },
  missingValues: ['N/A', 'Missing'],
  termOptions: [{ id: 'test', label: 'test' }],
  showStandardizedTerm: true,
  showMissingToggle: true,
  onUpdateDescription: () => {},
  onToggleMissingValue: () => {},
  onUpdateLevelTerm: () => {},
};

describe('Categorical', () => {
  it('should render the component correctly', () => {
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        levels={props.levels}
        termOptions={props.termOptions}
        showStandardizedTerm={props.showStandardizedTerm}
        showMissingToggle={props.showMissingToggle}
        onUpdateDescription={props.onUpdateDescription}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="3-categorical"]').should('be.visible');
    cy.get('[data-cy="3-value-table-head"]')
      .should('be.visible')
      .and('contain', 'Value')
      .and('contain', 'Description');
    cy.get('[data-cy="3-F"]').should('be.visible').and('contain', 'F');
    cy.get('[data-cy="3-F-description"]').should('be.visible').and('contain', 'Female');
  });
  it('should fire the onUpdateDescription event handler with the appropriate payload when the description is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        levels={props.levels}
        termOptions={props.termOptions}
        showStandardizedTerm={props.showStandardizedTerm}
        showMissingToggle={props.showMissingToggle}
        onUpdateDescription={spy}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="3-F-description"]').should('be.visible');
    cy.get('[data-cy="3-F-description"] textarea').first().clear();
    cy.get('[data-cy="3-F-description"]').type('new description');
    cy.get('@spy').should('have.been.calledWith', '3', 'F', 'new description');
  });
  it('should fire the onUpdateLevelTerm event handler with the appropriate payload when the level term is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        levels={props.levels}
        termOptions={props.termOptions}
        showStandardizedTerm={props.showStandardizedTerm}
        showMissingToggle={props.showMissingToggle}
        onUpdateDescription={props.onUpdateDescription}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateLevelTerm={spy}
      />
    );
    cy.get('[data-cy="3-F-term-dropdown"]').type('test{downArrow}{Enter}');
    cy.get('@spy').should('have.been.calledWith', '3', 'F', 'test');
  });

  it('should display the tooltip when hovering over an option', () => {
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        levels={props.levels}
        termOptions={props.termOptions}
        showStandardizedTerm={props.showStandardizedTerm}
        showMissingToggle={props.showMissingToggle}
        onUpdateDescription={props.onUpdateDescription}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="3-F-term-dropdown"]').click();
    cy.get('[data-cy="3-F-term-dropdown-option"]').trigger('mouseover');
    cy.get('[data-cy="3-F-term-tooltip"]').should('be.visible').and('contain.text', 'test');
  });
  it('should disable the standardized term dropdown when the value is marked as missing', () => {
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        levels={props.levels}
        termOptions={props.termOptions}
        showStandardizedTerm={props.showStandardizedTerm}
        showMissingToggle={props.showMissingToggle}
        onUpdateDescription={props.onUpdateDescription}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="3-N/A-term-dropdown"] input').should('be.disabled');
  });
});
