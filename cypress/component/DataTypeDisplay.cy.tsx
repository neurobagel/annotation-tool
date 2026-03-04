import { DataType } from '~/utils/internal_types';
import DataTypeDisplay from '../../src/components/DataTypeDisplay';

describe('DataTypeDisplay', () => {
  it('should render the component with a mapped categorical value', () => {
    cy.mount(<DataTypeDisplay columnId="1" value={DataType.categorical} inferredLabel={null} />);
    cy.get('[data-cy="1-column-annotation-card-data-type"]')
      .should('be.visible')
      .and('contain', 'Categorical');
  });

  it('should show inferred label when provided', () => {
    cy.mount(<DataTypeDisplay columnId="2" value={null} inferredLabel="Identifier" />);

    cy.get('[data-cy="2-column-annotation-card-data-type"]')
      .should('be.visible')
      .and('contain', 'Identifier');
  });

  it('should display placeholder when both inferredLabel and value are null', () => {
    cy.mount(<DataTypeDisplay columnId="4" value={null} inferredLabel={null} />);

    cy.get('[data-cy="4-column-annotation-card-data-type-unassigned"]')
      .should('be.visible')
      .and('contain', 'Assign data type');
  });
});
