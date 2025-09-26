import MissingValueGroupButton from '../../src/components/MissingValueGroupButton';

const props = {
  value: 'some value',
  columnId: '1',
  missingValues: [''],
  onToggleMissingValue: () => {},
};

describe('MissingValueButton', () => {
  it('renders the component correctly', () => {
    cy.mount(
      <MissingValueGroupButton
        value={props.value}
        columnId={props.columnId}
        missingValues={props.missingValues}
        onToggleMissingValue={props.onToggleMissingValue}
      />
    );
    cy.get('[data-cy="1-some value-missing-value-button-group"]').should('be.visible');
    cy.get('[data-cy="1-some value-missing-value-no"]').should('be.visible');
    cy.get('[data-cy="1-some value-missing-value-yes"]').should('be.visible');
  });

  describe('onToggleMissingValue behavior', () => {
    const testCases = [
      {
        description: 'when value is not marked as missing',
        missingValues: [''],
        treatAsMissingValue: 'yes',
        expectedCallArgs: ['1', 'some value', true],
      },
      {
        description: 'when value is already marked as missing',
        missingValues: ['some value'],
        treatAsMissingValue: 'no',
        expectedCallArgs: ['1', 'some value', false],
      },
    ];

    testCases.forEach(({ description, missingValues, treatAsMissingValue, expectedCallArgs }) => {
      it(`fires correct payload ${description}`, () => {
        const spy = cy.spy().as('spy');
        cy.mount(
          <MissingValueGroupButton
            value={props.value}
            columnId={props.columnId}
            missingValues={missingValues}
            onToggleMissingValue={spy}
          />
        );
        const selector = `[data-cy="1-some value-missing-value-${treatAsMissingValue}"]`;

        cy.get(selector).click();
        // Check that the button is not selected since the status is
        // determined by the prop not the selection that was just made
        cy.get(selector).should('not.have.class', 'Mui-selected');

        cy.get('@spy').should('have.been.calledWith', ...expectedCallArgs);
      });
    });
  });
});
