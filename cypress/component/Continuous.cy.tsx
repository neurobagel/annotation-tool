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
  onUpdateUnits: () => {},
  onToggleMissingValue: () => {},
  onUpdateFormat: () => {},
};

describe('Continuous', () => {
  it('renders the component correctly', () => {
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        columnValues={props.columnValues}
        missingValues={props.missingValues}
        format={props.format}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
      />
    );
    cy.get('[data-cy="1-description"]').should('be.visible').and('contain', 'some units');
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
});
