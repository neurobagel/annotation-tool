import MultiColumnMeasuresCard from '../../src/components/MultiColumnMeasuresCard';

const props = {
  card: {
    id: '1',
    term: {
      id: 'nb:coolTerm',
      label: 'cool',
    },
    mappedColumns: ['1'],
  },
  mappedColumnHeaders: {
    '1': 'participant_id',
    '2': 'age',
    '3': 'sex',
  },
  availableTerms: [
    {
      id: 'nb:someIdentifier',
      label: 'some',
      disabled: false,
    },
    {
      id: 'nb:anotherIdentifier',
      label: 'another',
      disabled: false,
    },
  ],
  columnOptions: [
    { id: '1', label: 'participant_id', isPartOfCollection: true },
    { id: '2', label: 'age', isPartOfCollection: false },
    { id: '3', label: 'sex', isPartOfCollection: false },
  ],
  onCreateCollection: () => {},
  onColumnSelect: () => {},
  onRemoveColumn: () => {},
  onRemoveCard: () => {},
};

describe('MultiColumnMeasuresCard', () => {
  it('renders the component correctly', () => {
    cy.mount(
      <MultiColumnMeasuresCard
        card={props.card}
        cardIndex={1}
        mappedColumnHeaders={props.mappedColumnHeaders}
        availableTerms={props.availableTerms}
        columnOptions={props.columnOptions}
        onCreateCollection={props.onCreateCollection}
        onColumnSelect={props.onColumnSelect}
        onRemoveColumn={props.onRemoveColumn}
        onRemoveCard={props.onRemoveCard}
      />
    );
    cy.get('[data-cy=multi-column-measures-card-1]').should('be.visible');
    cy.get('[data-cy=multi-column-measures-card-1]').should('be.visible').and('contain', 'cool');
    cy.get('[data-cy=multi-column-measures-card-1-columns-dropdown]').should('be.visible');
    cy.get('[data-cy=mapped-column-1]').should('be.visible').and('contain', 'participant_id');
  });
  it('fires onColumnSelect with the appropriate payload when a column is selected', () => {
    const spy = cy.spy().as('onColumnSelect');
    cy.mount(
      <MultiColumnMeasuresCard
        card={props.card}
        cardIndex={1}
        mappedColumnHeaders={props.mappedColumnHeaders}
        availableTerms={props.availableTerms}
        columnOptions={props.columnOptions}
        onCreateCollection={props.onCreateCollection}
        onColumnSelect={spy}
        onRemoveColumn={props.onRemoveColumn}
        onRemoveCard={props.onRemoveCard}
      />
    );
    cy.get('[data-cy=multi-column-measures-card-1-columns-dropdown]').type('age{downArrow}{enter}');
    cy.get('@onColumnSelect').should('have.been.calledWith', 'nb:coolTerm', '2');
  });
  it('fires onRemoveColumn with the appropriate payload when a chip is deleted', () => {
    const spy = cy.spy().as('onRemoveColumn');
    cy.mount(
      <MultiColumnMeasuresCard
        card={props.card}
        cardIndex={1}
        mappedColumnHeaders={props.mappedColumnHeaders}
        availableTerms={props.availableTerms}
        columnOptions={props.columnOptions}
        onCreateCollection={props.onCreateCollection}
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
        cardIndex={1}
        mappedColumnHeaders={props.mappedColumnHeaders}
        availableTerms={props.availableTerms}
        columnOptions={props.columnOptions}
        onCreateCollection={props.onCreateCollection}
        onColumnSelect={props.onColumnSelect}
        onRemoveColumn={props.onRemoveColumn}
        onRemoveCard={spy}
      />
    );
    cy.get('[data-cy=remove-card-1-button]').click();
    cy.get('@onRemoveCard').should('have.been.calledOnce');
  });
});
