import ValueAnnotation from '../../src/components/ValueAnnotation';

describe('ValueAnnotation', () => {
  it('should render correctly', () => {
    cy.mount(<ValueAnnotation />);
    cy.contains('Value Annotation');
  });
});
