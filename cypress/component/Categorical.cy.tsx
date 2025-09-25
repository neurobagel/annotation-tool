import Categorical from '../../src/components/Categorical';
import useDataStore from '../../src/stores/data';

const props = {
  columnID: '3',
  uniqueValues: ['F', 'M', 'N/A', 'Missing'],
  levels: {
    F: { description: 'Female' },
    M: { description: 'Male' },
  },
  missingValues: ['N/A', 'Missing'],
  standardizedVariable: {
    identifier: 'nb:Diagnosis',
    label: 'Diagnosis',
  },
  onUpdateDescription: () => {},
  onToggleMissingValue: () => {},
  onUpdateLevelTerm: () => {},
};

describe('Categorical', () => {
  beforeEach(() => {
    useDataStore.setState({
      termOptions: {
        'nb:Diagnosis': [{ label: 'test', identifier: 'test' }],
      },
    });
  });
  it('renders the component correctly', () => {
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        standardizedVariable={props.standardizedVariable}
        levels={props.levels}
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
  it('fires the onUpdateDescription event handler with the appropriate payload when the description is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        standardizedVariable={props.standardizedVariable}
        levels={props.levels}
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
  it('fires the onUpdateLevelTerm event handler with the appropriate payload when the level term is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        standardizedVariable={props.standardizedVariable}
        levels={props.levels}
        onUpdateDescription={props.onUpdateDescription}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateLevelTerm={spy}
      />
    );
    cy.get('[data-cy="3-F-term-dropdown"]').type('test{downArrow}{Enter}');
    cy.get('@spy').should('have.been.calledWith', '3', 'F', {
      identifier: 'test',
      label: 'test',
    });
  });
  it('alphabetically sorts and filters the values', () => {
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        standardizedVariable={props.standardizedVariable}
        levels={props.levels}
        onUpdateDescription={props.onUpdateDescription}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    // Helper function to get the value of a specific row
    const rowValue = (rowIdx: number) =>
      cy.get(`[data-cy="${props.columnID}-categorical-table"] tbody tr:eq(${rowIdx}) td:eq(0)`);

    // initial ascending order
    rowValue(0).should('contain', 'F');
    rowValue(3).should('contain', 'N/A');

    // switch to descending
    cy.get('[data-cy="3-sort-values-button"]').click();
    rowValue(0).should('contain', 'N/A');
    rowValue(3).should('contain', 'F');

    // show only missing
    cy.get('[data-cy="3-filter-status-button"]').click();
    rowValue(0).should('contain', 'N/A');
    rowValue(1).should('contain', 'Missing');
    cy.get('tbody tr').should('have.length', 2);

    // back to ascending + all rows
    cy.get('[data-cy="3-sort-values-button"]').click();
    cy.get('[data-cy="3-filter-status-button"]').click();
    rowValue(0).should('contain', 'F');
    rowValue(3).should('contain', 'N/A');
    cy.get('tbody tr').should('have.length', 4);
  });
  it('Displays the tooltip when hovering over an option', () => {
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        standardizedVariable={props.standardizedVariable}
        levels={props.levels}
        onUpdateDescription={props.onUpdateDescription}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="3-F-term-dropdown"]').click();
    cy.get('[data-cy="3-F-term-dropdown-option"]').trigger('mouseover');
    cy.get('[data-cy="3-F-term-tooltip"]').should('be.visible').and('contain.text', 'test');
  });
});
