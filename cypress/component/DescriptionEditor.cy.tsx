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
        columnID={props.id}
      />
    );
    cy.get('[data-cy="1-description"] textarea')
      .should('be.visible')
      .and('have.value', 'Sample description');
  });

  it('shows placeholder when no description is provided', () => {
    cy.mount(
      <DescriptionEditor
        description={null}
        onDescriptionChange={props.onDescriptionChange}
        columnID={props.id}
      />
    );
    cy.get('[data-cy="1-description"] textarea')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Click to add description...')
      .and('have.value', '');
  });

  it('auto-saves changes after typing', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <DescriptionEditor
        description={props.description}
        onDescriptionChange={spy}
        columnID={props.id}
      />
    );

    cy.get('[data-cy="1-description"] textarea').first().clear();
    cy.get('[data-cy="1-description"]').type('new description');
    cy.contains('Saving...').should('be.visible');
    cy.contains('Saved').should('be.visible');
    cy.get('@spy').should('have.been.calledWith', '1', 'new description');
  });

  it('handles empty input by converting to null', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <DescriptionEditor
        description={props.description}
        onDescriptionChange={spy}
        columnID={props.id}
      />
    );

    cy.get('[data-cy="1-description"] textarea').first().clear();
    cy.get('@spy').should('have.been.calledWith', '1', null);
  });
});
