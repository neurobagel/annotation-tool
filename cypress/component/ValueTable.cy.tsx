import ValueTable from '../../src/components/ValueTable';

const props = {
  columnID: '1',
  uniqueValues: ['1', '9', '22', '19', '99', '2', 'N/A'],
  missingValues: ['N/A', '9'],
  showMissingToggle: true,
  onToggleMissingValue: () => {},
};

describe('ValueTable', () => {
  // Helper function to get the value of a specific row
  const rowValue = (rowIdx: number) =>
    cy
      .get(`[data-cy="${props.columnID}-value-table-element"] .MuiTableRow-root`)
      .eq(rowIdx + 1)
      .find('.MuiTableCell-root')
      .eq(0);

  it('should render the component correctly', () => {
    cy.mount(
      <ValueTable
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        showMissingToggle={props.showMissingToggle}
        onToggleMissingValue={props.onToggleMissingValue}
      />
    );
    cy.get('[data-cy="1-value-table-element"]').should('be.visible');
    cy.get('[data-cy="1-value-table-head"]')
      .should('be.visible')
      .and('contain', 'Value')
      .and('contain', 'Treat as missing value');
    cy.get('[data-cy="1-22"]').should('be.visible').and('contain', '22');
  });

  it('should sort values alphabetically/naturally', () => {
    cy.mount(
      <ValueTable
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        showMissingToggle={props.showMissingToggle}
        onToggleMissingValue={props.onToggleMissingValue}
      />
    );

    // Initial state: values asc
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '9');
    rowValue(3).should('contain', '19');
    rowValue(4).should('contain', '22');
    rowValue(5).should('contain', '99');
    rowValue(6).should('contain', 'N/A');

    // Click value sort to desc
    cy.get('[data-cy="1-sort-values-button"]').click();
    rowValue(0).should('contain', 'N/A');
    rowValue(1).should('contain', '99');
    rowValue(2).should('contain', '22');
    rowValue(3).should('contain', '19');
    rowValue(4).should('contain', '9');
    rowValue(5).should('contain', '2');
    rowValue(6).should('contain', '1');

    // Click value sort back to asc
    cy.get('[data-cy="1-sort-values-button"]').click();
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '9');
    rowValue(3).should('contain', '19');
    rowValue(4).should('contain', '22');
    rowValue(5).should('contain', '99');
    rowValue(6).should('contain', 'N/A');
  });

  it('should sort values by missing status', () => {
    cy.mount(
      <ValueTable
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        showMissingToggle={props.showMissingToggle}
        onToggleMissingValue={props.onToggleMissingValue}
      />
    );

    // Initial state: sorting by value asc
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '9');
    rowValue(3).should('contain', '19');
    rowValue(4).should('contain', '22');
    rowValue(5).should('contain', '99');
    rowValue(6).should('contain', 'N/A');

    // Click missing status sort - switches to missing sort asc (missing first)
    cy.get('[data-cy="1-sort-status-button"]').click();
    rowValue(0).should('contain', '9');
    rowValue(1).should('contain', 'N/A');
    rowValue(2).should('contain', '1');
    rowValue(3).should('contain', '2');
    rowValue(4).should('contain', '19');
    rowValue(5).should('contain', '22');
    rowValue(6).should('contain', '99');

    // Click missing status sort again to desc (non-missing first)
    cy.get('[data-cy="1-sort-status-button"]').click();
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '19');
    rowValue(3).should('contain', '22');
    rowValue(4).should('contain', '99');
    rowValue(5).should('contain', '9');
    rowValue(6).should('contain', 'N/A');

    // Click value sort - switches back to value sort asc
    cy.get('[data-cy="1-sort-values-button"]').click();
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '9');
    rowValue(3).should('contain', '19');
    rowValue(4).should('contain', '22');
    rowValue(5).should('contain', '99');
    rowValue(6).should('contain', 'N/A');
  });

  it('should fire the onToggleMissingValue event handler when the missing value button is clicked', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ValueTable
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        showMissingToggle
        onToggleMissingValue={spy}
      />
    );

    // N/A is already missing, so click "is missing" -> false? Or we can click the "No" button.
    cy.get('[data-cy="1-22-missing-value-yes"]').click();
    cy.get('@spy').should('have.been.calledWith', '1', '22', true);
  });
});
