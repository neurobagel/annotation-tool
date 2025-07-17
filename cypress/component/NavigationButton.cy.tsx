import NavigationButton from '../../src/components/NavigationButton';
import useStore from '../../src/stores/view';
import { View } from '../../src/utils/internal_types';

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
});
