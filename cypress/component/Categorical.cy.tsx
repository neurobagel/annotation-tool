import Categorical from '../../src/components/Categorical';

const props = {
  columnID: '3',
  uniqueValues: ['F', 'M'],
  levels: {
    F: { description: 'Female' },
    M: { description: 'Male' },
  },
  onUpdateDescription: () => {},
};

describe('Categorical', () => {
  it('renders the component correctly', () => {
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        levels={props.levels}
        onUpdateDescription={props.onUpdateDescription}
      />
    );
    cy.get('[data-cy="3-categorical"]').should('be.visible');
    cy.get('[data-cy="3-categorical-table-head"]')
      .should('be.visible')
      .and('contain', 'Value')
      .and('contain', 'Description');
    cy.get('[data-cy="3-F"]').should('be.visible').and('contain', 'F');
    cy.get('[data-cy="3-F-description"]').should('be.visible').and('contain', 'Female');
    cy.get('[data-cy="3-F-edit-description-button"]').should('be.visible');
    cy.get('[data-cy="3-categorical-pagination"]').should('be.visible');
  });
  it('fires the onUpdateDescription event handler with the appropriate payload when the description is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        levels={props.levels}
        onUpdateDescription={spy}
      />
    );
    cy.get('[data-cy="3-F-edit-description-button"]').click();
    cy.get('[data-cy="3-F-description-input"]').clear();
    cy.get('[data-cy="3-F-description-input"]').type('new description');
    cy.get('[data-cy="3-F-save-description-button"]').click();
    cy.get('@spy').should('have.been.calledWith', '3', 'F', 'new description');
  });
});
