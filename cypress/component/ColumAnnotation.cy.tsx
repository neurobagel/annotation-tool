import ColumnAnnotation from '../../src/components/ColumnAnnotation';

describe('ColumnAnnotation', () => {
  it('should render correctly', () => {
    cy.mount(<ColumnAnnotation />);
    cy.contains('Column Annotation');
  });
});
