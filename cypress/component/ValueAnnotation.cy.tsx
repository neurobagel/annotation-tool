import ValueAnnotation from '../../src/components/ValueAnnotation';
import useDataStore from '../../src/stores/data';
import { mockColumnsWithDataType, mockColumns, mockConfig } from '../../src/utils/mocks';

describe('ValueAnnotation', () => {
  beforeEach(() => {
    useDataStore.setState({
      columns: { ...mockColumns, ...mockColumnsWithDataType },
      config: mockConfig,
    });

    // Update derived state after setting up the store
    const store = useDataStore.getState();
    store.updateMappedStandardizedVariables();
    store.updateMultiColumnMeasureVariableIdentifiers();
  });
  it('renders the component correctly', () => {
    cy.mount(<ValueAnnotation />);
    cy.get('[data-cy="no-column-selected"]')
      .should('be.visible')
      .and('contain', 'Please select a column to annotate values.');
    cy.get('[data-cy="side-column-nav-bar-diagnosis-select-button"]').click();
    cy.get('[data-cy="4-categorical"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-assessment tool-select-button"]').click();
    cy.get('[data-cy="6-continuous"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-categorical-select-button"]').click();
    cy.get('[data-cy="3-categorical"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-continuous-select-button"]').click();
    cy.get('[data-cy="1-continuous"]').should('be.visible');
    cy.get('[data-cy="side-column-nav-bar-other-select-button"]').click();
    cy.get('[data-cy="other"]')
      .should('be.visible')
      .and('contain', 'The following columns do not have an assigned data type')
      .and('contain', 'age')
      .and('contain', 'group');
  });
  it('asserts that there is no shared state between EditDescription components in Continuous component', () => {
    /*
     Set the data type of column 2 (age) to Continuous
     to make sure there is no shared state between the
    EditDescription in Continuous component
    */
    useDataStore.setState((state) => ({
      columns: {
        ...state.columns,
        2: {
          ...state.columns[2],
          bidsType: 'Continuous',
        },
      },
    }));

    // Update derived state after modifying columns
    const store = useDataStore.getState();
    store.updateMappedStandardizedVariables();

    cy.mount(<ValueAnnotation />);
    cy.get('[data-cy="side-column-nav-bar-continuous-select-button"]').click();
    cy.get('[data-cy="1-description"]').should('be.visible');
    cy.get('[data-cy="1-description"] textarea').first().clear();
    cy.get('[data-cy="1-description"]').type('Years');
    cy.get('[data-cy="2-tab"]').click();
    cy.get('[data-cy="2-description"]').should('be.visible');
    cy.get('[data-cy="2-description"]').should('not.contain', 'Years');
  });
});
