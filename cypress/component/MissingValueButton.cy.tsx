import MissingValueButton from '../../src/components/MissingValueButton';

const props = {
  value: 'some value',
  columnId: '1',
  missingValues: [''],
  onToggleMissingValue: () => {},
};

describe('MissingValueButton', () => {
  it('renders the component correctly', () => {
    cy.mount(
      <MissingValueButton
        value={props.value}
        columnId={props.columnId}
        missingValues={props.missingValues}
        onToggleMissingValue={props.onToggleMissingValue}
      />
    );
    cy.get('[data-cy="1-some value-missing-value-button"]')
      .should('be.visible')
      .and('contain', 'Mark as missing');
  });
  it('fires onToggleMissingValue with the appropriate payload when the missing value button is clicked', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <MissingValueButton
        value={props.value}
        columnId={props.columnId}
        missingValues={props.missingValues}
        onToggleMissingValue={spy}
      />
    );
    cy.get('[data-cy="1-some value-missing-value-button"]').click();
    cy.get('@spy').should('have.been.calledWith', '1', 'some value', true);
  });
});
