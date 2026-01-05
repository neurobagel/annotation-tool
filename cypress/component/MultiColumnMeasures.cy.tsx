import MultiColumnMeasures from '../../src/components/MultiColumnMeasures';
import { useDataStore } from '../../src/stores/data';

describe('MultiColumnMeasures', () => {
  beforeEach(() => {
    useDataStore.setState((state) => ({
      ...state,
      columns: {},
      standardizedVariables: {},
      standardizedTerms: {},
    }));

    const columns = {
      '1': {
        id: '1',
        name: 'some column',
        allValues: [],
        standardizedVariable: 'nb:Assessment',
        isPartOf: 'nb:SomeTerm',
      },
      '2': {
        id: '2',
        name: 'another column',
        allValues: [],
        standardizedVariable: 'nb:Assessment',
      },
      '3': {
        id: '3',
        name: 'some other column',
        allValues: [],
        standardizedVariable: 'nb:Assessment',
      },
    };

    const standardizedVariables = {
      'nb:Assessment': {
        id: 'nb:Assessment',
        name: 'Assessment Tool',
        is_multi_column_measure: true,
      },
    };

    const standardizedTerms = {
      'nb:SomeTerm': {
        id: 'nb:SomeTerm',
        label: 'some term',
        standardizedVariableId: 'nb:Assessment',
        collectionCreatedAt: '1',
      },
      'nb:AnotherTerm': {
        id: 'nb:AnotherTerm',
        label: 'another term',
        standardizedVariableId: 'nb:Assessment',
        collectionCreatedAt: undefined,
      },
      'nb:OtherTerm': {
        id: 'nb:OtherTerm',
        label: 'some other term',
        standardizedVariableId: 'nb:Assessment',
        collectionCreatedAt: undefined,
      },
    };

    useDataStore.setState((state) => ({
      ...state,
      columns,
      standardizedVariables,
      standardizedTerms,
    }));

    cy.spy(useDataStore.getState().actions, 'userUpdatesColumnToCollectionMapping').as(
      'userUpdatesColumnToCollectionMappingSpy'
    );
    cy.spy(useDataStore.getState().actions, 'userUpdatesColumnStandardizedVariable').as(
      'userUpdatesColumnStandardizedVariableSpy'
    );
    cy.spy(useDataStore.getState().actions, 'userCreatesCollection').as('userCreatesCollectionSpy');
    cy.spy(useDataStore.getState().actions, 'userDeletesCollection').as('userDeletesCollectionSpy');

    cy.mount(<MultiColumnMeasures />);
  });

  it('should render the component correctly', () => {
    cy.get('[data-cy="multi-column-measures-card-0"]').should('be.visible');
    cy.get('[data-cy="remove-card-0-button"]').should('be.visible');
    cy.get('[data-cy="multi-column-measures-card-0-header"]').should('contain', 'some term');
    cy.get('[data-cy="mapped-column-1"]').should('be.visible').and('contain', 'some column');
    cy.get('[data-cy="multi-column-measures-columns-side-bar"]')
      .should('be.visible')
      .and('contain', 'some column')
      .and('contain', 'another column')
      .and('contain', 'some other column')
      .and('contain', '1 column assigned');
  });

  it('should map a column to a collection when selected', () => {
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-1-title-dropdown"]').should('be.visible');
    cy.get('[data-cy="multi-column-measures-card-1-title-dropdown"]').type(
      'another term{downArrow}{enter}'
    );
    cy.get('[data-cy="multi-column-measures-card-1-columns-dropdown"]').type(
      'another column{downArrow}{enter}'
    );
    cy.get('@userUpdatesColumnToCollectionMappingSpy').should(
      'have.been.calledWith',
      '2',
      'nb:AnotherTerm'
    );
    cy.get('@userCreatesCollectionSpy').should('have.been.calledWith', 'nb:AnotherTerm');
    cy.get('[data-cy="mapped-column-2"]').should('be.visible').and('contain', 'another column');
  });

  it('should unmap a column when its chip is removed', () => {
    cy.get('[data-cy="mapped-column-1"]').should('be.visible').and('contain', 'some column');
    cy.get('[data-cy="mapped-column-1"] svg').click();
    cy.get('@userUpdatesColumnToCollectionMappingSpy').should('have.been.calledWith', '1', null);
    cy.get('[data-cy="mapped-column-1"]').should('not.exist');
  });

  it('should delete a collection when its card is removed', () => {
    cy.get('[data-cy="remove-card-0-button"]').click();
    cy.get('@userUpdatesColumnToCollectionMappingSpy').should('have.been.calledWith', '1', null);
    cy.get('@userDeletesCollectionSpy').should('have.been.calledWith', 'nb:SomeTerm');
    cy.get('[data-cy="mapped-column-1"]').should('not.exist');
  });
  it('should fire userUpdatesColumnStandardizedVariable when a column is unassigned', () => {
    cy.get('[data-cy="unassign-column-1"]').click();
    cy.get('@userUpdatesColumnStandardizedVariableSpy').should('have.been.calledWith', '1', null);
    cy.get('[data-cy="mapped-column-1"]').should('not.exist');
  });
});
