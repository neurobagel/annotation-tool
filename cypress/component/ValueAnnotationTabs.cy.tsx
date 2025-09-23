import { mockColumns, mockConfig, mockDataTable } from '~/utils/mocks';
import ValueAnnotationTabs from '../../src/components/ValueAnnotationTabs';
import useDataStore from '../../src/stores/data';

const props = {
  columns: mockColumns,
  dataTable: mockDataTable,
  onUpdateDescription: () => {},
  onUpdateUnits: () => {},
  onToggleMissingValue: () => {},
  onUpdateFormat: () => {},
  onUpdateLevelTerm: () => {},
};

describe('ValueAnnotationTabs', () => {
  beforeEach(() => {
    useDataStore.setState({
      config: mockConfig,
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
        ],
      },
      termOptions: {
        'nb:Sex': [{ identifier: 'test', label: 'test' }],
      },
    });
  });
  it('renders the component correctly', () => {
    cy.mount(
      <ValueAnnotationTabs
        columns={props.columns}
        dataTable={props.dataTable}
        onUpdateDescription={props.onUpdateDescription}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="value-annotation-tabs"]').should('be.visible');
    cy.get('[data-cy="1-tab"]').should('be.visible').and('contain', 'participant_id');
    cy.get('[data-cy="2-tab"]').should('be.visible').and('contain', 'age');
    cy.get('[data-cy="3-tab"]').should('be.visible').and('contain', 'sex');
    cy.get('[data-cy="4-tab"]').should('be.visible').and('contain', 'group_dx');
    cy.get('[data-cy="5-tab"]').should('be.visible').and('contain', 'group');
    cy.get('[data-cy="6-tab"]').should('be.visible').and('contain', 'iq');
  });
  it('fires onUpdateDescription with the appropriate payload when the description is updated', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ValueAnnotationTabs
        columns={props.columns}
        dataTable={props.dataTable}
        onUpdateDescription={spy}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="3-tab"]').click();
    cy.get('[data-cy="3-M-description"]').should('be.visible');
    cy.get('[data-cy="3-M-description"]').first().clear();
    cy.get('[data-cy="3-M-description"]').type('new units');
    cy.get('@spy').should('have.been.calledWith', '3', 'M', 'new units');
  });
  it('fires onUpdateUnits with the appropriate payload when the units field is updated', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ValueAnnotationTabs
        columns={props.columns}
        dataTable={props.dataTable}
        onUpdateDescription={props.onUpdateDescription}
        onUpdateUnits={spy}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="2-tab"]').click();
    cy.get('[data-cy="2-description"]').should('be.visible');
    cy.get('[data-cy="2-description"]').type('new units');
    cy.get('@spy').should('have.been.calledWith', '2', 'new units');
  });
  it('fires onToggleMissingValue with the appropriate payload when the missing value button is clicked', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ValueAnnotationTabs
        columns={props.columns}
        dataTable={props.dataTable}
        onUpdateDescription={props.onUpdateDescription}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={spy}
        onUpdateFormat={props.onUpdateFormat}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="2-tab"]').click();
    cy.get('[data-cy="2-23-missing-value-yes"]').click();
    cy.get('@spy').should('have.been.calledWith', '2', '23', true);
  });
  it('fires onUpdateFormat with the appropriate payload when the format field is updated', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ValueAnnotationTabs
        columns={props.columns}
        dataTable={props.dataTable}
        onUpdateDescription={props.onUpdateDescription}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={spy}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="2-tab"]').click();
    cy.get('[data-cy="2-format-dropdown"]').type('euro{downArrow}{Enter}');
    cy.get('@spy').should('have.been.calledWith', '2', { termURL: 'nb:FromEuro', label: 'euro' });
  });
  it('fires onUpdateLevelTerm with the appropriate payload when the level term is updated', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ValueAnnotationTabs
        columns={props.columns}
        dataTable={props.dataTable}
        onUpdateDescription={props.onUpdateDescription}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
        onUpdateLevelTerm={spy}
      />
    );
    cy.get('[data-cy="3-tab"]').click();
    cy.get('[data-cy="3-F-term-dropdown"]').type('test{downArrow}{Enter}');
    cy.get('@spy').should('have.been.calledWith', '3', 'F', {
      identifier: 'test',
      label: 'test',
    });
  });
});
