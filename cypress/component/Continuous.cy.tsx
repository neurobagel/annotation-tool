import Continuous from '../../src/components/Continuous';

const baseProps = {
  columnID: '1',
  units: 'some units',
  uniqueValues: ['1', '2', '3', '4', '5'],
  missingValues: [],
  formatId: 'nb:FromBounded',
  formatOptions: [
    { id: 'nb:FromFloat', label: 'float', examples: ['31.5'] },
    { id: 'nb:FromEuro', label: 'euro', examples: ['31,5'] },
    { id: 'nb:FromBounded', label: 'bounded', examples: ['30+'] },
    { id: 'nb:FromRange', label: 'range', examples: ['30-35'] },
    { id: 'nb:FromISO8601', label: 'iso8601', examples: ['31Y6M'] },
  ],
  showUnits: true,
  showFormat: true,
  showMissingToggle: true,
  onUpdateUnits: () => {},
  onToggleMissingValue: () => {},
  onUpdateFormat: () => {},
};

describe('Continuous', () => {
  it('should render the component correctly for an annotated column', () => {
    cy.mount(
      <Continuous
        columnID={baseProps.columnID}
        units={baseProps.units}
        uniqueValues={baseProps.uniqueValues}
        missingValues={baseProps.missingValues}
        formatId={baseProps.formatId}
        formatOptions={baseProps.formatOptions}
        showUnits={baseProps.showUnits}
        showFormat={baseProps.showFormat}
        showMissingToggle={baseProps.showMissingToggle}
        onUpdateUnits={baseProps.onUpdateUnits}
        onToggleMissingValue={baseProps.onToggleMissingValue}
        onUpdateFormat={baseProps.onUpdateFormat}
      />
    );
    cy.get('[data-cy="1-description"]').should('be.visible').and('contain', 'some units');
    cy.get('[data-cy="1-1-value"]').should('be.visible').and('contain', '1');
    cy.get('[data-cy="1-3-missing-value-button-group"]').should('be.visible');
    cy.get('[data-cy="1-format-dropdown"]').should('be.visible');
  });
  it('should render the component correctly for a unannotated column', () => {
    cy.mount(
      <Continuous
        columnID={baseProps.columnID}
        units={baseProps.units}
        uniqueValues={baseProps.uniqueValues}
        missingValues={baseProps.missingValues}
        formatId={baseProps.formatId}
        formatOptions={baseProps.formatOptions}
        showUnits
        showFormat={false}
        showMissingToggle={false}
        onUpdateUnits={baseProps.onUpdateUnits}
        onToggleMissingValue={baseProps.onToggleMissingValue}
        onUpdateFormat={baseProps.onUpdateFormat}
      />
    );
    cy.get('[data-cy="1-description"]').should('be.visible').and('contain', 'some units');
    cy.get('[data-cy="1-3-missing-value-button-group"]').should('not.exist');
    cy.get('[data-cy="1-format-dropdown"]').should('not.exist');
    cy.get('[data-cy="1-continuous"]').should('be.visible');
  });
  it('should fire the onUpdateUnits event handler with the appropriate payload when the description is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Continuous
        columnID={baseProps.columnID}
        units={baseProps.units}
        uniqueValues={baseProps.uniqueValues}
        missingValues={baseProps.missingValues}
        formatId={baseProps.formatId}
        formatOptions={baseProps.formatOptions}
        showUnits={baseProps.showUnits}
        onUpdateUnits={spy}
        onToggleMissingValue={baseProps.onToggleMissingValue}
        onUpdateFormat={baseProps.onUpdateFormat}
      />
    );
    cy.get('[data-cy="1-description"]').should('be.visible');
    cy.get('[data-cy="1-description"] textarea').first().clear();
    cy.get('[data-cy="1-description"]').type('new units');
    cy.get('@spy').should('have.been.calledWith', '1', 'new units');
  });
  it('should fire the onToggleMissingValue event handler with the appropriate payload when the missing value button is clicked', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Continuous
        columnID={baseProps.columnID}
        units={baseProps.units}
        uniqueValues={baseProps.uniqueValues}
        missingValues={baseProps.missingValues}
        formatId={baseProps.formatId}
        formatOptions={baseProps.formatOptions}
        showMissingToggle
        onUpdateUnits={baseProps.onUpdateUnits}
        onToggleMissingValue={spy}
        onUpdateFormat={baseProps.onUpdateFormat}
      />
    );
    cy.get('[data-cy="1-3-missing-value-yes"]').click();
    cy.get('@spy').should('have.been.calledWith', '1', '3', true);
  });
  it('should fire the onUpdateFormat event handler with the appropriate payload when the format is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Continuous
        columnID={baseProps.columnID}
        units={baseProps.units}
        uniqueValues={baseProps.uniqueValues}
        missingValues={baseProps.missingValues}
        formatId={baseProps.formatId}
        formatOptions={baseProps.formatOptions}
        showFormat
        onUpdateUnits={baseProps.onUpdateUnits}
        onToggleMissingValue={baseProps.onToggleMissingValue}
        onUpdateFormat={spy}
      />
    );
    cy.get('[data-cy="1-format-dropdown"]').type('float{downarrow}{enter}');
    cy.get('@spy').should('have.been.calledWith', '1', 'nb:FromFloat');
  });
});
