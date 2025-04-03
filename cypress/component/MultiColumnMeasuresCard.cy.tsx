import { mockColumnsWithDescription } from '~/utils/mocks';
import MultiColumnMeasuresCard from '../../src/components/MultiColumnMeasuresCard';

const props = {
  card: {
    id: '1',
    term: {
      identifier: 'nb:coolTerm',
      label: 'cool',
    },
    mappedColumns: ['1'],
  },
  columns: mockColumnsWithDescription,
  availableTerms: [
    {
      identifier: 'nb:someIdentifier',
      label: 'some',
    },
    {
      identifier: 'nb:anotherIdentifier',
      label: 'another',
    },
  ],
  columnOptions: [
    { id: '1', label: 'participant_id', disabled: true },
    { id: '2', label: 'age', disabled: false },
    { id: '3', label: 'sex', disabled: false },
  ],
  onTermSelect: () => {},
  onColumnSelect: () => {},
  onRemoveColumn: () => {},
  onRemoveCard: () => {},
};

describe('MultiColumnMeasuresCard', () => {
  it('renders the component correctly', () => {
    cy.mount(
      <MultiColumnMeasuresCard
        card={props.card}
        columns={props.columns}
        availableTerms={props.availableTerms}
        columnOptions={props.columnOptions}
        onTermSelect={props.onTermSelect}
        onColumnSelect={props.onColumnSelect}
        onRemoveColumn={props.onRemoveColumn}
        onRemoveCard={props.onRemoveCard}
      />
    );
    cy.get('[data-cy=multi-column-measure-card-1]').should('be.visible');
    cy.get('[data-cy=multi-column-measures-card-1]').should('be.visible').and('contain', 'cool');
    cy.get('[data-cy=multi-column-measures-card-1-columns-dropdown]').should('be.visible');
    cy.get('[data-cy=mapped-column-1]').should('be.visible').and('contain', 'participant_id');
  });
  it('fires onColumnSelect with the appropriate payload when a column is selected', () => {
    const spy = cy.spy().as('onColumnSelect');
    cy.mount(
      <MultiColumnMeasuresCard
        card={props.card}
        columns={props.columns}
        availableTerms={props.availableTerms}
        columnOptions={props.columnOptions}
        onTermSelect={props.onTermSelect}
        onColumnSelect={spy}
        onRemoveColumn={props.onRemoveColumn}
        onRemoveCard={props.onRemoveCard}
      />
    );
    cy.get('[data-cy=multi-column-measures-card-1-columns-dropdown]').type('age{downArrow}{enter}');
    cy.get('@onColumnSelect').should('have.been.calledWith', '2');
  });
  it('fires onRemoveColumn with the appropriate payload when a chip is deleted', () => {
    const spy = cy.spy().as('onRemoveColumn');
    cy.mount(
      <MultiColumnMeasuresCard
        card={props.card}
        columns={props.columns}
        availableTerms={props.availableTerms}
        columnOptions={props.columnOptions}
        onTermSelect={props.onTermSelect}
        onColumnSelect={props.onColumnSelect}
        onRemoveColumn={spy}
        onRemoveCard={props.onRemoveCard}
      />
    );

    cy.get('[data-cy=mapped-column-1] svg').click();
    cy.get('@onRemoveColumn').should('have.been.calledWith', '1');
  });

  it('fires onRemoveCard when the remove button is clicked', () => {
    const spy = cy.spy().as('onRemoveCard');
    cy.mount(
      <MultiColumnMeasuresCard
        card={props.card}
        columns={props.columns}
        availableTerms={props.availableTerms}
        columnOptions={props.columnOptions}
        onTermSelect={props.onTermSelect}
        onColumnSelect={props.onColumnSelect}
        onRemoveColumn={props.onRemoveColumn}
        onRemoveCard={spy}
      />
    );
    cy.get('[data-cy=remove-card-1-button]').click();
    cy.get('@onRemoveCard').should('have.been.calledOnce');
  });
});
