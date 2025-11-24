import { View } from '../../internal_types';
import NavStepper from '../../src/components/NavStepper';

const props = {
  currentView: View.ValueAnnotation,
};

describe('Stepper component', () => {
  it('renders the component correctly', () => {
    cy.mount(<NavStepper currentView={props.currentView} />);
    cy.get('[data-cy="nav-stepper"]').should('be.visible');
    cy.get('[data-cy="nav-stepper"]')
      .should('contain', 'Upload')
      .and('contain', 'Column Annotation')
      .and('contain', 'Value Annotation')
      .and('contain', 'Download');
    cy.get('[data-cy="Upload-step"]').within(() => {
      cy.get('.MuiStepLabel-iconContainer').should('not.have.class', 'Mui-active');
    });
    cy.get('[data-cy="Value Annotation-step"]').within(() => {
      cy.get('.MuiStepLabel-iconContainer').should('have.class', 'Mui-active');
    });
  });
});
