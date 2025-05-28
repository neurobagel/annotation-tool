import { mockColumns } from '~/utils/mocks';
import ColumnTypeCollapse from '../../src/components/ColumnTypeCollapse';

const props = {
  dataType: 'Continuous' as 'Categorical' | 'Continuous' | null,
  standardizedVariable: {
    identifier: 'nb:ParticipantID',
    label: 'Subject ID',
  },
  columns: mockColumns,
  onSelect: () => {},
  selectedColumnId: '1',
};

describe('ColumnTypeCollapse', () => {
  it('renders the component correctly', () => {
    cy.mount(
      <ColumnTypeCollapse
        dataType={props.dataType}
        standardizedVariable={props.standardizedVariable}
        columns={props.columns}
        onSelect={props.onSelect}
        selectedColumnId={props.selectedColumnId}
      />
    );
    cy.get('[data-cy="side-column-nav-bar-subject id"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-subject id-toggle-button"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-subject id-participant_id"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-subject id-select-button"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-subject id-toggle-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-subject id-participant_id"]').should('not.be.visible');
    cy.mount(
      <ColumnTypeCollapse
        dataType={props.dataType}
        standardizedVariable={null}
        columns={props.columns}
        onSelect={props.onSelect}
        selectedColumnId={props.selectedColumnId}
      />
    );
    cy.get('[data-cy="side-column-nav-bar-continuous"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-continuous-toggle-button"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-continuous-select-button"]').should('be.visible');
    cy.mount(
      <ColumnTypeCollapse
        dataType={'Categorical' as 'Categorical' | 'Continuous' | null}
        standardizedVariable={null}
        columns={props.columns}
        onSelect={props.onSelect}
        selectedColumnId={props.selectedColumnId}
      />
    );
    cy.get('[data-cy="side-column-nav-bar-categorical"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-categorical-toggle-button"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-categorical-select-button"]').should('be.visible');
  });
  it('fires onSelect with the appropriate payload when a column is selected', () => {
    const spy = cy.spy().as('onSelect');
    cy.mount(
      <ColumnTypeCollapse
        dataType={props.dataType}
        standardizedVariable={props.standardizedVariable}
        columns={props.columns}
        onSelect={spy}
        selectedColumnId={props.selectedColumnId}
      />
    );
    cy.get('[data-cy="side-column-nav-bar-subject id-select-button"]').click();
    cy.get('@onSelect').should('have.been.calledWith', {
      columnIDs: ['1'],
      dataType: 'Continuous',
    });
  });
});
