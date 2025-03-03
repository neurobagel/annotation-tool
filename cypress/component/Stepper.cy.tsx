import Stepper from '../../src/components/Stepper';
import { View } from '../../src/utils/types';

const props = {
  currentView: View.ValueAnnotation,
};

describe('Stepper component', () => {
  it('renders the component correctly', () => {
    cy.mount(<Stepper currentView={props.currentView} />);
    cy.get('[data-cy="stepper"]').should('be.visible');
    cy.get('[data-cy="stepper"]')
      .should('contain', 'Upload')
      .and('contain', 'Column Annotation')
      .and('contain', 'Value Annotation')
      .and('contain', 'Download');
    cy.get('[data-cy="Upload-step"]').should('not.have.class', 'Mui-active');
  });
});
