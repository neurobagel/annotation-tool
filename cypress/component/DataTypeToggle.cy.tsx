import { DataType } from '~/utils/internal_types';
import DataTypeToggle from '../../src/components/DataTypeToggle';

const props = {
  columnId: '1',
  value: DataType.categorical,
  isEditable: true,
  inferredLabel: null as string | null,
  onChange: () => {},
};

describe('DataTypeToggle', () => {
  beforeEach(() => {
    cy.mount(
      <DataTypeToggle
        columnId={props.columnId}
        value={props.value}
        isEditable={props.isEditable}
        inferredLabel={props.inferredLabel}
        onChange={props.onChange}
      />
    );
  });

  it('renders the component', () => {
    cy.get('[data-cy="1-column-annotation-card-data-type"]').should('be.visible');
    cy.get('[data-cy="1-column-annotation-card-data-type-categorical-button"]').should(
      'be.visible'
    );
    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').should('be.visible');
  });

  it('Fires the onChange event handler with the appropriate payload when the data type is toggled', () => {
    const spy = cy.spy().as('spy');

    cy.mount(
      <DataTypeToggle
        columnId={props.columnId}
        value={props.value}
        isEditable={props.isEditable}
        inferredLabel={props.inferredLabel}
        onChange={spy}
      />
    );

    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').click();
    cy.get('@spy').should('have.been.calledWith', '1', 'Continuous');
  });

  it('shows inferred label when data type is locked', () => {
    cy.mount(
      <DataTypeToggle
        columnId="2"
        value={null}
        isEditable={false}
        inferredLabel="Identifier"
        onChange={props.onChange}
      />
    );

    cy.get('[data-cy="2-column-annotation-card-data-type"]').should('contain', 'Identifier');
  });
});
