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

  describe('onToggleMissingValue behavior', () => {
    const testCases = [
      {
        description: 'when value is not marked as missing',
        missingValues: [''],
        expectedButtonText: 'Mark as missing',
        expectedCallArgs: ['1', 'some value', true],
      },
      {
        description: 'when value is already marked as missing',
        missingValues: ['some value'],
        expectedButtonText: 'Mark as not missing',
        expectedCallArgs: ['1', 'some value', false],
      },
    ];

    testCases.forEach(({ description, missingValues, expectedButtonText, expectedCallArgs }) => {
      it(`fires correct payload ${description}`, () => {
        const spy = cy.spy().as('spy');
        cy.mount(
          <MissingValueButton
            value={props.value}
            columnId={props.columnId}
            missingValues={missingValues}
            onToggleMissingValue={spy}
          />
        );

        cy.get('[data-cy="1-some value-missing-value-button"]')
          .should('contain.text', expectedButtonText, { matchCase: false })
          .click();

        cy.get('@spy').should('have.been.calledWith', ...expectedCallArgs);
      });
    });
  });
});
