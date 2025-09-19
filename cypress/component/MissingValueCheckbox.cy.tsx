import MissingValueCheckbox from '../../src/components/MissingValueCheckbox';

const props = {
  value: 'some value',
  columnId: '1',
  missingValues: [''],
  onToggleMissingValue: () => {},
};

describe('MissingValueButton', () => {
  it('renders the component correctly', () => {
    cy.mount(
      <MissingValueCheckbox
        value={props.value}
        columnId={props.columnId}
        missingValues={props.missingValues}
        onToggleMissingValue={props.onToggleMissingValue}
      />
    );
    cy.get('[data-cy="1-some value-missing-value-checkbox"]').should('be.visible');
  });

  describe('onToggleMissingValue behavior', () => {
    const testCases = [
      {
        description: 'when value is not marked as missing',
        missingValues: [''],
        expectedCheckboxState: 'not.be.checked',
        expectedCallArgs: ['1', 'some value', true],
      },
      {
        description: 'when value is already marked as missing',
        missingValues: ['some value'],
        expectedCheckboxState: 'be.checked',
        expectedCallArgs: ['1', 'some value', false],
      },
    ];

    testCases.forEach(({ description, missingValues, expectedCheckboxState, expectedCallArgs }) => {
      it(`fires correct payload ${description}`, () => {
        const spy = cy.spy().as('spy');
        cy.mount(
          <MissingValueCheckbox
            value={props.value}
            columnId={props.columnId}
            missingValues={missingValues}
            onToggleMissingValue={spy}
          />
        );

        cy.get('[data-cy="1-some value-missing-value-checkbox"]').click();
        cy.get('[data-cy="1-some value-missing-value-checkbox"] input').should(
          expectedCheckboxState
        );

        cy.get('@spy').should('have.been.calledWith', ...expectedCallArgs);
      });
    });
  });
});
