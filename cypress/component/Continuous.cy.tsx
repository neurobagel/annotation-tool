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
  // Helper function to get the value of a specific row
  const rowValue = (rowIdx: number) =>
    cy.get(`[data-cy="${baseProps.columnID}-continuous-table"] tbody tr:eq(${rowIdx}) td:eq(0)`);

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
    cy.get('[data-cy="1-1-0-value"]').should('be.visible').and('contain', '1');
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
    cy.get('[data-cy="1-continuous-table"]').should('be.visible');
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
  it('should sort values in natural order', () => {
    cy.mount(
      <Continuous
        columnID={baseProps.columnID}
        units={baseProps.units}
        uniqueValues={['1', '9', '22', '19', '99', '2']}
        missingValues={[]}
        formatId={baseProps.formatId}
        formatOptions={baseProps.formatOptions}
        showMissingToggle
        onUpdateUnits={baseProps.onUpdateUnits}
        onToggleMissingValue={baseProps.onToggleMissingValue}
        onUpdateFormat={baseProps.onUpdateFormat}
      />
    );

    // Initial state: values asc
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '9');
    rowValue(3).should('contain', '19');
    rowValue(4).should('contain', '22');
    rowValue(5).should('contain', '99');

    // Click value sort to desc
    cy.get('[data-cy="1-sort-values-button"]').click();
    rowValue(0).should('contain', '99');
    rowValue(1).should('contain', '22');
    rowValue(2).should('contain', '19');
    rowValue(3).should('contain', '9');
    rowValue(4).should('contain', '2');
    rowValue(5).should('contain', '1');

    // Click value sort back to asc
    cy.get('[data-cy="1-sort-values-button"]').click();
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '9');
    rowValue(3).should('contain', '19');
    rowValue(4).should('contain', '22');
    rowValue(5).should('contain', '99');
  });

  it('should sort values by missing status', () => {
    cy.mount(
      <Continuous
        columnID={baseProps.columnID}
        units={baseProps.units}
        uniqueValues={['22', '1', '19', '9', '99', '2']}
        missingValues={['9', '22']}
        formatId={baseProps.formatId}
        formatOptions={baseProps.formatOptions}
        showMissingToggle
        onUpdateUnits={baseProps.onUpdateUnits}
        onToggleMissingValue={baseProps.onToggleMissingValue}
        onUpdateFormat={baseProps.onUpdateFormat}
      />
    );

    // Initial state: sorting by value asc
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '9');
    rowValue(3).should('contain', '19');
    rowValue(4).should('contain', '22');
    rowValue(5).should('contain', '99');

    // Click missing status sort - switches to missing sort asc (missing first)
    cy.get('[data-cy="1-sort-status-button"]').click();
    rowValue(0).should('contain', '9');
    rowValue(1).should('contain', '22');
    rowValue(2).should('contain', '1');
    rowValue(3).should('contain', '2');
    rowValue(4).should('contain', '19');
    rowValue(5).should('contain', '99');

    // Click missing status sort again to desc (non-missing)
    cy.get('[data-cy="1-sort-status-button"]').click();
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '19');
    rowValue(3).should('contain', '99');
    rowValue(4).should('contain', '9');
    rowValue(5).should('contain', '22');

    // Click value sort - switches back to value sort asc
    cy.get('[data-cy="1-sort-values-button"]').click();
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '9');
    rowValue(3).should('contain', '19');
    rowValue(4).should('contain', '22');
    rowValue(5).should('contain', '99');
  });
});
