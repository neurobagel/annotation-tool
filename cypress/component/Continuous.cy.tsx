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
    cy.get('[data-cy="1-3-missing-value-button"]').should('not.exist');
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
    cy.get('[data-cy="1-3-missing-value-button"]').click();
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
  it('sorts and filters the values', () => {
    cy.mount(
      <Continuous
        columnID={props.columnID}
        units={props.units}
        uniqueValues={props.uniqueValues}
        missingValues={['3', '4']}
        format={props.format}
        standardizedVariable={props.standardizedVariable}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
      />
    );
    // column id 1-value 1-index 0
    cy.get('[data-cy="1-1-0-value"]').should('contain', '1');
    cy.get('[data-cy="1-sort-values-button"]').click();
    // After sorting column id 1-value 5-index 0
    cy.get('[data-cy="1-5-0-value"]').should('contain', '5');
    cy.get('[data-cy="1-filter-status-button"]').click();
    cy.get('[data-cy="1-1-0-value"]').should('not.exist');
    cy.get('[data-cy="1-5-0-value"]').should('not.exist');
    cy.get('[data-cy="1-4-0-value"]').should('contain', '4');
    cy.get('[data-cy="1-sort-values-button"]').click();
    cy.get('[data-cy="1-3-0-value"]').should('contain', '3');
    cy.get('[data-cy="1-filter-status-button"]').click();
    cy.get('[data-cy="1-1-0-value"]').should('be.visible').and('contain', '1');
    cy.get('[data-cy="1-5-4-value"]').should('be.visible');
  });
});
