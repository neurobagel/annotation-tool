import ValueAnnotation from '../../src/components/ValueAnnotation';
import { mockColumnsWithDataType } from '../../src/utils/mocks';
import useDataStore from '../../src/stores/data';

describe('ValueAnnotation', () => {
  it('renders the component correctly', () => {
    useDataStore.setState({ columns: mockColumnsWithDataType });
    cy.mount(<ValueAnnotation />);
    cy.get('[data-cy="no-column-selected"]')
      .should('be.visible')
      .and('contain', 'Please select a column to annotate values.');
    cy.get('[data-cy="side-column-nav-bar-categorical-sex"]').click();
    cy.get('[data-cy="3-categorical"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-continuous-participant_id"]').click();
    cy.get('[data-cy="1-continuous"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-other-age"]').click();
    cy.get('[data-cy="other-placeholder"]')
      .should('be.visible')
      .and('contain', 'Please select the appropriate data type for this column.');
  });
});
