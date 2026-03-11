import StandardizedVariablesList from '../../src/components/StandardizedVariablesList';
import { useDataStore } from '../../src/stores/data';
import {
  StandardizedVariable,
  StandardizedTerm,
  VariableType,
} from '../../src/utils/internal_types';

describe('StandardizedVariablesList', () => {
  const mockVariables: Record<string, StandardizedVariable> = {
    'var-1': {
      id: 'var-1',
      name: 'Age',
      variable_type: VariableType.continuous,
      can_have_multiple_columns: false,
    },
    'var-2': {
      id: 'var-2',
      name: 'Assessment',
      variable_type: VariableType.collection,
      can_have_multiple_columns: false,
    },
    'var-3': {
      id: 'var-3',
      name: 'Sex',
      variable_type: VariableType.categorical,
      can_have_multiple_columns: true,
    },
  };

  const mockTerms: Record<string, StandardizedTerm> = {
    'term-1': { id: 'term-1', label: 'UPDRS', standardizedVariableId: 'var-2' },
    'term-2': { id: 'term-2', label: 'MOCA', standardizedVariableId: 'var-2' },
  };

  beforeEach(() => {
    useDataStore.setState({
      standardizedVariables: mockVariables as unknown as Record<string, StandardizedVariable>,
      standardizedTerms: mockTerms as unknown as Record<string, StandardizedTerm>,
    });
  });

  it('renders the flat list of standardized variables', () => {
    cy.mount(<StandardizedVariablesList />);

    cy.get('[data-cy="standardized-variables-list"]').should('be.visible');

    cy.get('[data-cy="standardized-variables-list"]').should('contain', 'Age');
    cy.get('[data-cy="standardized-variables-list"]').should('contain', 'Sex');
    cy.get('[data-cy="standardized-variables-list"]').should('contain', 'Assessment');

    cy.get('[data-cy="standardized-variables-list"]').should('contain', 'UPDRS');
    cy.get('[data-cy="standardized-variables-list"]').should('contain', 'MOCA');
  });

  it('should filter terms', () => {
    cy.mount(<StandardizedVariablesList />);

    cy.get('[data-cy="standardized-variables-list"]').should('contain', 'UPDRS');
    cy.get('[data-cy="standardized-variables-list"]').should('contain', 'MOCA');

    cy.get('[data-cy="search-terms-input"] input').type('MOC');

    cy.get('[data-cy="standardized-variables-list"]').should('contain', 'MOCA');
    cy.get('[data-cy="standardized-variables-list"]').should('not.contain', 'UPDRS');
  });

  it('should fire the onItemSelect event handler with the appropriate payload when a term is selected', () => {
    const onItemSelectSpy = cy.spy().as('onItemSelectSpy');
    cy.mount(<StandardizedVariablesList onItemSelect={onItemSelectSpy} selectedItemId={null} />);

    cy.get('[data-cy="collection-term-item-term-2"]').click();

    cy.get('@onItemSelectSpy').should('have.been.calledWith', 'term-2');
  });

  it('should fire the onItemSelect event handler with the appropriate payload if the same item is selected again', () => {
    const onItemSelectSpy = cy.spy().as('onItemSelectSpy');
    cy.mount(<StandardizedVariablesList onItemSelect={onItemSelectSpy} selectedItemId="term-2" />);

    cy.get('[data-cy="collection-term-item-term-2"]').click();

    cy.get('@onItemSelectSpy').should('have.been.calledWith', null);
  });

  it('should fire the onItemSelect event handler with the appropriate payload when a non-collection variable is selected', () => {
    const onItemSelectSpy = cy.spy().as('onItemSelectSpy');
    cy.mount(<StandardizedVariablesList onItemSelect={onItemSelectSpy} selectedItemId={null} />);

    cy.get('[data-cy="standardized-variable-item-var-1"]').click();

    cy.get('@onItemSelectSpy').should('have.been.calledWith', 'var-1');
  });

  it('should disable single-column variables that are already mapped', () => {
    const mappedVariableIds = new Set(['var-1', 'var-2', 'var-3']);
    cy.mount(<StandardizedVariablesList mappedVariableIds={mappedVariableIds} />);

    // var-1 should be disabled
    cy.get('[data-cy="standardized-variable-item-var-1"]')
      .should('have.class', 'opacity-50')
      .and('have.attr', 'aria-disabled', 'true');

    // var-3 should NOT be disabled because it can have multiple columns
    cy.get('[data-cy="standardized-variable-item-var-3"]')
      .should('not.have.class', 'opacity-50')
      .and('have.attr', 'aria-disabled', 'false');

    // var-2 is a collection variable, so its container should be disabled
    cy.get('[data-cy="collection-item-var-2"]')
      .should('have.class', 'opacity-50')
      .and('have.attr', 'aria-disabled', 'true');
  });
});
