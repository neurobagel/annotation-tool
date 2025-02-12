import NavigationButton from '../../src/components/NavigationButton';
import useStore from '../../src/stores/store';

const props = {
  label: 'Next',
  viewToNavigateTo: 'some view',
};

describe('NavigationButton', () => {
  it('should render correctly', () => {
    cy.mount(<NavigationButton label={props.label} viewToNavigateTo={props.viewToNavigateTo} />);
    cy.contains(props.label);
  });

  it('should call setCurrentView with the correct view when clicked', () => {
    cy.spy(useStore.getState(), 'setCurrentView').as('setCurrentViewSpy');

    cy.mount(<NavigationButton label={props.label} viewToNavigateTo={props.viewToNavigateTo} />);

    cy.contains(props.label).click();

    cy.get('@setCurrentViewSpy').should('have.been.calledWith', props.viewToNavigateTo);
  });
});
