import ColumnAnnotation from '../../src/components/ColumnAnnotation';

describe('ColumnAnnotation', () => {
  it('should render correctly', () => {
    cy.mount(<ColumnAnnotation />);
    cy.contains('Column Annotation');
  });
  it.only('toggles the data type between categorical and continuous', () => {
    cy.get('[data-cy="1-column-annotation-card-data-type-categorical-button"]').should(
      'have.class',
      'Mui-selected'
    );
    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').should(
      'not.have.class',
      'Mui-selected'
    );
    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').click();
    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').should(
      'have.class',
      'Mui-selected'
    );
    cy.get('[data-cy="1-column-annotation-card-data-type-categorical-button"]').should(
      'not.have.class',
      'Mui-selected'
    );
  });
});
