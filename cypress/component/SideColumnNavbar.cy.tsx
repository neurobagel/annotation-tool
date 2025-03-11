import SideColumnNavBar from '../../src/components/SideColumnNavBar';
import { mockColumnsWithDataType } from '../../src/utils/mocks';

const props = {
  columns: mockColumnsWithDataType,
  onSelectColumn: () => {},
  selectedColumnId: '1',
};

describe('SideColumnNavBar', () => {
  it('renders the component correctly', () => {
    cy.mount(
      <SideColumnNavBar
        columns={props.columns}
        onSelectColumn={props.onSelectColumn}
        selectedColumnId={props.selectedColumnId}
      />
    );
    cy.get('[data-cy="side-column-nav-bar-categorical"]')
      .should('be.visible')
      .and('contain', 'sex');
    cy.get('[data-cy="side-column-nav-bar-continuous"]')
      .should('be.visible')
      .and('contain', 'participant_id');
    cy.get('[data-cy="side-column-nav-bar-continuous"] .MuiTypography-root').should(
      'have.css',
      'font-weight',
      '700'
    ); // bold
    cy.get('[data-cy="side-column-nav-bar-other"]').should('be.visible').and('contain', 'age');
    cy.get('[data-cy="side-column-nav-bar-categorical-toggle-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-categorical-sex"]').should('not.be.visible');
    cy.get('[data-cy="side-column-nav-bar-continuous-toggle-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-continuous-participant_id"]').should('not.be.visible');
    cy.get('[data-cy="side-column-nav-bar-other-toggle-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-other-age"]').should('not.be.visible');
  });
  it('Fires the onSelectColumn event handler with the appropriate payload when a column is clicked', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <SideColumnNavBar
        columns={props.columns}
        onSelectColumn={spy}
        selectedColumnId={props.selectedColumnId}
      />
    );
    cy.get('[data-cy="side-column-nav-bar-categorical-sex"]').click();
    cy.get('@spy').should('have.been.calledWith', '3', 'Categorical');
  });
});
