import SideColumnNavBar from '../../src/components/SideColumnNavBar';
import useDataStore from '../../src/stores/data';
import { mockColumnsWithDataType, mockColumns, mockConfig } from '../../src/utils/mocks';

const props = {
  columns: { ...mockColumns, ...mockColumnsWithDataType },
  onSelect: () => {},
  selectedColumnId: '1',
};

describe('SideColumnNavBar', () => {
  beforeEach(() => {
    useDataStore.setState({
      columns: props.columns,
      config: mockConfig,
    });

    // Update derived state after setting up the store
    const store = useDataStore.getState();
    store.updateMappedStandardizedVariables();
  });
  it('renders the component correctly', () => {
    cy.mount(
      <SideColumnNavBar
        columns={props.columns}
        onSelect={props.onSelect}
        selectedColumnId={props.selectedColumnId}
      />
    );
    cy.get('[data-cy="side-column-nav-bar-diagnosis"]')
      .should('be.visible')
      .and('contain', 'group_dx');
    cy.get('[data-cy="side-column-nav-bar-assessment tool"]')
      .should('be.visible')
      .and('contain', 'Previous IQ assessment by pronunciation');
    cy.get('[data-cy="side-column-nav-bar-annotated-toggle-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-diagnosis"]').should('not.be.visible');
    cy.get('[data-cy="side-column-nav-bar-assessment tool"]').should('not.be.visible');
    cy.get('[data-cy="side-column-nav-bar-categorical"]')
      .should('be.visible')
      .and('contain', 'sex');
    cy.get('[data-cy="side-column-nav-bar-continuous"]')
      .should('be.visible')
      .and('contain', 'some_continuous_column');
    cy.get('[data-cy="side-column-nav-bar-continuous"] .MuiTypography-root').should(
      'have.css',
      'font-weight',
      '700'
    ); // bold
    cy.get('[data-cy="side-column-nav-bar-other"]').should('be.visible').and('contain', 'age');
    cy.get('[data-cy="side-column-nav-bar-categorical-toggle-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-categorical-sex"]').should('not.be.visible');
    cy.get('[data-cy="side-column-nav-bar-continuous-toggle-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-continuous-some_continuous_column"]').should(
      'not.be.visible'
    );
    cy.get('[data-cy="side-column-nav-bar-other-toggle-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-other-age"]').should('not.be.visible');
  });
  it('Fires the onSelect event handler with the appropriate payload when a column is clicked', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <SideColumnNavBar
        columns={props.columns}
        onSelect={spy}
        selectedColumnId={props.selectedColumnId}
      />
    );
    cy.get('[data-cy="side-column-nav-bar-categorical-select-button"]').click();
    cy.get('@spy').should('have.been.calledWith', { columnIDs: ['3'], dataType: 'Categorical' });
  });
});
