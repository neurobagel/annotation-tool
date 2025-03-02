import NavigationButton from '../../src/components/NavigationButton';
import useStore from '../../src/stores/view';
import { View } from '../../src/utils/types';

const props = {
  backView: View.Upload,
  nextView: View.ColumnAnnotation,
};

describe('NavigationButton', () => {
  it('should render correctly', () => {
    cy.mount(<NavigationButton backView={props.backView} nextView={props.nextView} />);
    cy.contains('Upload');
  });

  it('should call setCurrentView with the correct view when clicked', () => {
    cy.spy(useStore.getState(), 'setCurrentView').as('setCurrentViewSpy');

    cy.mount(<NavigationButton backView={props.backView} nextView={props.nextView} />);

    cy.contains(props.nextView).click();

    cy.get('@setCurrentViewSpy').should('have.been.calledWith', props.nextView);
  });
});
