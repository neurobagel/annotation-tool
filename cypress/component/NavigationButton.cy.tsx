import { View } from '../../datamodel';
import NavigationButton from '../../src/components/NavigationButton';
import useStore from '../../src/stores/view';

const props = {
  backView: View.Upload,
  nextView: View.ColumnAnnotation,
  backLabel: 'Back',
  nextLabel: 'Next',
};

describe('NavigationButton', () => {
  it('should render correctly', () => {
    cy.mount(
      <NavigationButton
        backView={props.backView}
        nextView={props.nextView}
        backLabel="Back"
        nextLabel="Next"
      />
    );
    cy.get('[data-cy="back-button"]').should('be.visible').and('contain', 'Back');
    cy.get('[data-cy="next-button"]').should('be.visible').and('contain', 'Next');
  });

  it('should call setCurrentView with the correct view when clicked', () => {
    cy.spy(useStore.getState(), 'setCurrentView').as('setCurrentViewSpy');

    cy.mount(
      <NavigationButton
        backView={props.backView}
        nextView={props.nextView}
        backLabel="Back"
        nextLabel="Next"
      />
    );

    cy.get('[data-cy="next-button"]').click();

    cy.get('@setCurrentViewSpy').should('have.been.calledWith', props.nextView);
  });
  it('should disable buttons when disable props are true', () => {
    cy.mount(
      <NavigationButton
        backView={props.backView}
        nextView={props.nextView}
        backLabel="Back"
        nextLabel="Next"
        disableBack
        disableNext
      />
    );
    cy.get('[data-cy="back-button"]').should('be.disabled');
    cy.get('[data-cy="next-button"]').should('be.disabled');
  });
});
