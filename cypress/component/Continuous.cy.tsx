import Continuous from '../../src/components/Continuous';

const props = {
  columnID: '1',
  units: 'some units',
  columnValues: ['1', '2', '3', '4', '5'],
  missingValues: [],
  format: {
    termURL: 'nb:FromBounded',
    label: 'bounded',
  },
  standardizedVariable: {
    identifier: 'nb:Age',
    label: 'Age',
  },
  onUpdateUnits: () => {},
  onToggleMissingValue: () => {},
  onUpdateFormat: () => {},
};

describe('Continuous', () => {
  it('renders the component correctly for an annotated column', () => {
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        columnValues={props.columnValues}
        missingValues={props.missingValues}
        format={props.format}
        standardizedVariable={props.standardizedVariable}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
      />
    );
    cy.get('[data-cy="1-description"]').should('be.visible').and('contain', 'some units');
    cy.get('[data-cy="1-1-0-value"]').should('be.visible').and('contain', '1');
    cy.get('[data-cy="1-3-missing-value-button"]')
      .should('be.visible')
      .and('contain', 'Mark as missing');
    cy.get('[data-cy="1-format-dropdown"]').should('be.visible');
  });
  it('renders the component correctly for a unannotated column', () => {
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        columnValues={props.columnValues}
        missingValues={props.missingValues}
        format={props.format}
        standardizedVariable={null}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
      />
    );
    cy.get('[data-cy="1-description"]').should('be.visible').and('contain', 'some units');
    cy.get('[data-cy="1-3-missing-value-button"]').should('not.exist');
    cy.get('[data-cy="1-format-dropdown"]').should('not.exist');
    cy.get('[data-cy="1-continuous-table"]').should('be.visible');
    cy.get('[data-cy="1-continuous-pagination"]').should('be.visible');
  });
  it('fires the onUpdateUnits event handler with the appropriate payload when the description is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        columnValues={props.columnValues}
        missingValues={props.missingValues}
        format={props.format}
        onUpdateUnits={spy}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
      />
    );
    cy.get('[data-cy="1-edit-description-button"]').click();
    cy.get('[data-cy="1-description-input"]').clear();
    cy.get('[data-cy="1-description-input"]').type('new units');
    cy.get('[data-cy="1-save-description-button"]').click();
    cy.get('@spy').should('have.been.calledWith', '1', 'new units');
  });
  it('fires the onToggleMissingValue event handler with the appropriate payload when the missing value button is clicked', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        columnValues={props.columnValues}
        missingValues={props.missingValues}
        format={props.format}
        standardizedVariable={props.standardizedVariable}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={spy}
        onUpdateFormat={props.onUpdateFormat}
      />
    );
    cy.get('[data-cy="1-3-missing-value-button"]').click();
    cy.get('@spy').should('have.been.calledWith', '1', '3', true);
  });
  it('fires the onUpdateFormat event handler with the appropriate payload when the format is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        columnValues={props.columnValues}
        missingValues={props.missingValues}
        format={props.format}
        standardizedVariable={props.standardizedVariable}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={spy}
      />
    );
    cy.get('[data-cy="1-format-dropdown"]').type('float{downarrow}{enter}');
    cy.get('@spy').should('have.been.calledWith', '1', { termURL: 'nb:FromFloat', label: 'float' });
  });
});
