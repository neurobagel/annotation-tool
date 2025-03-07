import DescriptionEditor from '../../src/components/DescriptionEditor';

const props = {
  description: 'Sample description',
  onDescriptionChange: () => {},
  id: '1',
};

describe('DescriptionEditor', () => {
  it('renders the component correctly', () => {
    cy.mount(
      <DescriptionEditor
        description={props.description}
        onDescriptionChange={props.onDescriptionChange}
        id={props.id}
      />
    );
    cy.get('[data-cy="1-description"]').should('be.visible').and('contain', 'Sample description');
    cy.get('[data-cy="1-edit-description-button"]').should('be.visible');
    cy.get('[data-cy="1-edit-description-button"]').click();
    cy.get('[data-cy="1-save-description-button"]').should('be.visible');
    cy.get('[data-cy="1-description-input"]')
      .should('be.visible')
      .and('contain', 'Sample description');
    cy.get('[data-cy="1-save-description-button"]').click();
    cy.get('[data-cy="1-description-input"]').should('not.exist');
  });
  it('fires the onDescriptionChange event handler with the appropriate payload when the save button is clicked', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <DescriptionEditor description={props.description} onDescriptionChange={spy} id={props.id} />
    );
    cy.get('[data-cy="1-edit-description-button"]').click();
    cy.get('[data-cy="1-description-input"]').clear();
    cy.get('[data-cy="1-description-input"]').type('new description');
    cy.get('[data-cy="1-save-description-button"]').click();
    cy.get('@spy').should('have.been.calledWith', '1', 'new description');
  });
});
