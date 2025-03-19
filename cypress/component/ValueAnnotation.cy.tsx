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
  it('asserts that there is no shared state between EditDescription components in Continuous component', () => {
    useDataStore.setState({ columns: mockColumnsWithDataType });
    useDataStore.setState((state) => ({
      columns: {
        ...state.columns,
        2: {
          ...state.columns[2],
          dataType: 'Continuous',
        },
      },
    }));

    cy.mount(<ValueAnnotation />);
    cy.get('[data-cy="side-column-nav-bar-continuous-participant_id"]').click();
    cy.get('[data-cy="1-continuous"]').should('be.visible');
    cy.get('[data-cy="1-edit-description-button"]').click();
    cy.get('[data-cy="1-description-input"]').clear();
    cy.get('[data-cy="1-description-input"]').type('Years');
    cy.get('[data-cy="1-save-description-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-continuous-participant_id"]').click();
    cy.get('[data-cy="side-column-nav-bar-continuous-age"]').click();
    cy.get('[data-cy="2-continuous"]').should('be.visible');
    cy.get('[data-cy="2-description"]').should('contain', '');
    cy.get('[data-cy="2-edit-description-button"]').click();
    cy.get('[data-cy="2-description-input"]').should('not.contain', 'Years');
  });
});
