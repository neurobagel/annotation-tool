import Continuous from '../../src/components/Continuous';
import useDataStore from '../../src/stores/data';
import { mockConfig } from '../../src/utils/mocks';

const props = {
  columnID: '1',
  units: 'some units',
  uniqueValues: ['1', '2', '3', '4', '5'],
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
  // Helper function to get the value of a specific row
  const rowValue = (rowIdx: number) =>
    cy.get(`[data-cy="${props.columnID}-continuous-table"] tbody tr:eq(${rowIdx}) td:eq(0)`);

  beforeEach(() => {
    useDataStore.setState({
      formatOptions: {
        'nb:Age': [
          {
            termURL: 'nb:FromFloat',
            label: 'float',
            examples: ['31.5'],
          },
          {
            termURL: 'nb:FromEuro',
            label: 'euro',
            examples: ['31,5'],
          },
          {
            termURL: 'nb:FromBounded',
            label: 'bounded',
            examples: ['30+'],
          },
          {
            termURL: 'nb:FromRange',
            label: 'range',
            examples: ['30-35'],
          },
          {
            termURL: 'nb:FromISO8601',
            label: 'iso8601',
            examples: ['31Y6M'],
          },
        ],
      },
    });
  });
  it('renders the component correctly for an annotated column', () => {
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        uniqueValues={props.uniqueValues}
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
    cy.get('[data-cy="1-3-missing-value-button-group"]').should('be.visible');
    cy.get('[data-cy="1-format-dropdown"]').should('be.visible');
  });
  it('renders the component correctly for a unannotated column', () => {
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        format={props.format}
        standardizedVariable={null}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
      />
    );
    cy.get('[data-cy="1-description"]').should('be.visible').and('contain', 'some units');
    cy.get('[data-cy="1-3-missing-value-button-group"]').should('not.exist');
    cy.get('[data-cy="1-format-dropdown"]').should('not.exist');
    cy.get('[data-cy="1-continuous-table"]').should('be.visible');
  });
  it('fires the onUpdateUnits event handler with the appropriate payload when the description is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        format={props.format}
        onUpdateUnits={spy}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
      />
    );
    cy.get('[data-cy="1-description"]').should('be.visible');
    cy.get('[data-cy="1-description"] textarea').first().clear();
    cy.get('[data-cy="1-description"]').type('new units');
    cy.get('@spy').should('have.been.calledWith', '1', 'new units');
  });
  it('fires the onToggleMissingValue event handler with the appropriate payload when the missing value button is clicked', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        format={props.format}
        standardizedVariable={props.standardizedVariable}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={spy}
        onUpdateFormat={props.onUpdateFormat}
      />
    );
    cy.get('[data-cy="1-3-missing-value-yes"]').click();
    cy.get('@spy').should('have.been.calledWith', '1', '3', true);
  });
  it('fires the onUpdateFormat event handler with the appropriate payload when the format is changed', () => {
    useDataStore.setState({ config: mockConfig });
    const spy = cy.spy().as('spy');
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        uniqueValues={props.uniqueValues}
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
  it('sorts values in order', () => {
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        uniqueValues={['1', '9', '22', '19', '99', '2']}
        missingValues={[]}
        format={props.format}
        standardizedVariable={props.standardizedVariable}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
      />
    );

    // Initial state: values asc (1, 2, 19, 99, 9, 22)
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '9');
    rowValue(3).should('contain', '19');
    rowValue(4).should('contain', '22');
    rowValue(5).should('contain', '99');

    // Click value sort to desc (99, 19, 2, 1, 22, 9)
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

  it('sorts values by missing status', () => {
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        uniqueValues={['22', '1', '19', '9', '99', '2']}
        missingValues={['9', '22']}
        format={props.format}
        standardizedVariable={props.standardizedVariable}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
      />
    );

    // Initial state: missing status asc (non-missing first: 1, 2, 19, 99, then missing: 9, 22)
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '19');
    rowValue(3).should('contain', '99');
    rowValue(4).should('contain', '9');
    rowValue(5).should('contain', '22');

    // Click missing status sort to desc (missing first: 9, 22, then non-missing: 1, 2, 19, 99)
    cy.get('[data-cy="1-sort-status-button"]').click();
    rowValue(0).should('contain', '9');
    rowValue(1).should('contain', '22');
    rowValue(2).should('contain', '1');
    rowValue(3).should('contain', '2');
    rowValue(4).should('contain', '19');
    rowValue(5).should('contain', '99');

    // Click missing status sort back to asc
    cy.get('[data-cy="1-sort-status-button"]').click();
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '19');
    rowValue(3).should('contain', '99');
    rowValue(4).should('contain', '9');
    rowValue(5).should('contain', '22');

    cy.get('tbody tr').should('have.length', 6);
  });

  it('sorts values by missing status and alphabetical order combined', () => {
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        uniqueValues={['22', '1', '19', '9', '99', '2']}
        missingValues={['9', '22']}
        format={props.format}
        standardizedVariable={props.standardizedVariable}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
      />
    );

    // Initial state: missing asc, values asc (1, 2, 19, 99, 9, 22)
    rowValue(0).should('contain', '1');
    rowValue(1).should('contain', '2');
    rowValue(2).should('contain', '19');
    rowValue(3).should('contain', '99');
    rowValue(4).should('contain', '9');
    rowValue(5).should('contain', '22');

    // Change to missing desc, values asc (9, 22, 1, 2, 19, 99)
    cy.get('[data-cy="1-sort-status-button"]').click();
    rowValue(0).should('contain', '9');
    rowValue(1).should('contain', '22');
    rowValue(2).should('contain', '1');
    rowValue(3).should('contain', '2');
    rowValue(4).should('contain', '19');
    rowValue(5).should('contain', '99');

    // Change to missing desc, values desc (22, 9, 99, 19, 2, 1)
    cy.get('[data-cy="1-sort-values-button"]').click();
    rowValue(0).should('contain', '22');
    rowValue(1).should('contain', '9');
    rowValue(2).should('contain', '99');
    rowValue(3).should('contain', '19');
    rowValue(4).should('contain', '2');
    rowValue(5).should('contain', '1');

    // Change to missing asc, values desc (99, 19, 2, 1, 22, 9)
    cy.get('[data-cy="1-sort-status-button"]').click();
    rowValue(0).should('contain', '99');
    rowValue(1).should('contain', '19');
    rowValue(2).should('contain', '2');
    rowValue(3).should('contain', '1');
    rowValue(4).should('contain', '22');
    rowValue(5).should('contain', '9');

    cy.get('tbody tr').should('have.length', 6);
  });
});
