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
  // Helper function to get the value of a specific row
  const rowValue = (rowIdx: number) =>
    cy.get(`[data-cy="${props.columnID}-categorical-table"] tbody tr:eq(${rowIdx}) td:eq(0)`);

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
  it('sorts values alphabetically', () => {
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={[]}
        standardizedVariable={props.standardizedVariable}
        levels={props.levels}
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

  it('sorts values by missing status', () => {
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
});
