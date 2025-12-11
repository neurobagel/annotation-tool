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
  // Helper function to get the value of a specific row
  const rowValue = (rowIdx: number) =>
    cy.get(`[data-cy="${props.columnID}-categorical-table"] tbody tr:eq(${rowIdx}) td:eq(0)`);

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
    cy.get('[data-cy="3-categorical-table-head"]')
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
  it('should sort values alphabetically', () => {
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={[]}
        levels={props.levels}
        termOptions={props.termOptions}
        showStandardizedTerm={props.showStandardizedTerm}
        showMissingToggle={props.showMissingToggle}
        onUpdateDescription={props.onUpdateDescription}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );

    // Initial state: values asc
    rowValue(0).should('contain', 'F');
    rowValue(1).should('contain', 'M');
    rowValue(2).should('contain', 'Missing');
    rowValue(3).should('contain', 'N/A');

    // Click value sort to desc
    cy.get('[data-cy="3-sort-values-button"]').click();
    rowValue(0).should('contain', 'N/A');
    rowValue(1).should('contain', 'Missing');
    rowValue(2).should('contain', 'M');
    rowValue(3).should('contain', 'F');

    // Click value sort back to asc
    cy.get('[data-cy="3-sort-values-button"]').click();
    rowValue(0).should('contain', 'F');
    rowValue(1).should('contain', 'M');
    rowValue(2).should('contain', 'Missing');
    rowValue(3).should('contain', 'N/A');
  });

  it('should sort values by missing status', () => {
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

    // Initial state: sorting by value asc
    rowValue(0).should('contain', 'F');
    rowValue(1).should('contain', 'M');
    rowValue(2).should('contain', 'Missing');
    rowValue(3).should('contain', 'N/A');

    // Click missing status sort - switches to missing sort asc (missing first)
    cy.get('[data-cy="3-sort-status-button"]').click();
    rowValue(0).should('contain', 'Missing');
    rowValue(1).should('contain', 'N/A');
    rowValue(2).should('contain', 'F');
    rowValue(3).should('contain', 'M');

    // Click missing status sort again to desc (non-missing first)
    cy.get('[data-cy="3-sort-status-button"]').click();
    rowValue(0).should('contain', 'F');
    rowValue(1).should('contain', 'M');
    rowValue(2).should('contain', 'Missing');
    rowValue(3).should('contain', 'N/A');

    // Click value sort - switches back to value sort asc
    cy.get('[data-cy="3-sort-values-button"]').click();
    rowValue(0).should('contain', 'F');
    rowValue(1).should('contain', 'M');
    rowValue(2).should('contain', 'Missing');
    rowValue(3).should('contain', 'N/A');
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
