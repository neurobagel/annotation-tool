import ColumnAnnotation from '../../src/components/ColumnAnnotation';
import { useDataStore } from '../../src/stores/data';
import { DataType, Columns } from '../../src/utils/internal_types';
import { mockStandardizedVariables, mockStandardizedTerms } from '../../src/utils/mocks';

const createMockColumns = (): Columns => ({
  '1': {
    id: '1',
    name: 'some column',
    description: 'This is some column',
    dataType: DataType.categorical,
    standardizedVariable: 'nb:Assessment',
    allValues: ['value-1', 'value-2'],
  },
  '2': {
    id: '2',
    name: 'another column',
    description: 'This is another column',
    dataType: DataType.continuous,
    standardizedVariable: null,
    allValues: ['10', '20'],
  },
  '3': {
    id: '3',
    name: 'third column',
    description: 'This is third column',
    dataType: DataType.categorical,
    standardizedVariable: null,
    allValues: ['M', 'F'],
  },
  '4': {
    id: '4',
    name: 'fourth column',
    description: 'This is fourth column',
    dataType: DataType.continuous,
    standardizedVariable: 'nb:ParticipantID',
    allValues: ['100', '200'],
  },
});

describe('ColumnAnnotation', () => {
  beforeEach(() => {
    useDataStore.setState({
      columns: createMockColumns(),
      standardizedVariables: mockStandardizedVariables,
      standardizedTerms: mockStandardizedTerms,
    });
  });

  it('should render the component correctly', () => {
    cy.mount(<ColumnAnnotation />);
    cy.get('[data-cy="column-annotation-container"]').should('be.visible');
    cy.get('[data-cy="1-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="1-description"] textarea')
      .should('be.visible')
      .and('have.value', 'This is some column');
    cy.get('[data-cy="1-column-annotation-card-mapped-variable"]')
      .should('be.visible')
      .and('contain', 'Assessment Tool');
    cy.get('[data-cy="1-column-annotation-card-data-type"]')
      .should('be.visible')
      .and('contain', 'Categorical');
    cy.get('[data-cy="2-column-annotation-card"]').scrollIntoView();
    cy.get('[data-cy="2-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="2-description"] textarea')
      .should('be.visible')
      .and('have.value', 'This is another column');
    cy.get('[data-cy="2-column-annotation-card-mapped-variable-unassigned"]')
      .should('be.visible')
      .and('contain', 'Map to standardized variable');
    cy.get('[data-cy="2-column-annotation-card-data-type"]')
      .should('be.visible')
      .and('contain', 'Continuous');
  });

  it('should scroll to access all column cards', () => {
    cy.mount(<ColumnAnnotation />);
    cy.get('[data-cy="scrollable-container"]').should('be.visible');

    // Initially visible cards
    cy.get('[data-cy="1-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="2-column-annotation-card"]').should('be.visible');

    // Scroll to bottom to access remaining cards
    cy.get('[data-cy="scrollable-container"]').scrollTo('bottom');
    cy.get('[data-cy="3-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="4-column-annotation-card"]').should('be.visible');

    // Scroll back to top
    cy.get('[data-cy="scrollable-container"]').scrollTo('top');
    cy.get('[data-cy="1-column-annotation-card"]').should('be.visible');
  });
  it('should edit the description', () => {
    cy.spy(useDataStore.getState().actions, 'userUpdatesColumnDescription').as(
      'userUpdatesColumnDescription'
    );
    cy.mount(<ColumnAnnotation />);
    cy.get('[data-cy="1-description"] textarea')
      .first()
      .as('descriptionTextarea')
      .should('be.visible');
    cy.get('@descriptionTextarea').clear();
    cy.get('@descriptionTextarea').type('new description');
    cy.get('@userUpdatesColumnDescription').should('have.been.calledWith', '1', 'new description');
  });

  it('should filter columns based on search input', () => {
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="search-filter-input"]').should('be.visible');
    cy.get('[data-cy="search-filter-counter"]').should('contain', 'Showing 4 of 4 columns');

    cy.get('[data-cy="search-filter-input"]').type('another');

    cy.get('[data-cy="search-filter-counter"]').should('contain', '1 of 4');
    cy.get('[data-cy="2-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="1-column-annotation-card"]').should('not.exist');
    cy.get('[data-cy="3-column-annotation-card"]').should('not.exist');
    cy.get('[data-cy="4-column-annotation-card"]').should('not.exist');

    cy.get('[data-cy="search-filter-clear"]').click();
    cy.get('[data-cy="search-filter-input"] input').should('have.value', '');
    cy.get('[data-cy="search-filter-counter"]').should('contain', '4 of 4');

    cy.get('[data-cy="search-filter-input"]').type('COLUMN');
    cy.get('[data-cy="search-filter-counter"]').should('contain', '4 of 4');

    cy.get('[data-cy="search-filter-input"]').type('{selectall}{backspace}NONEXISTENT');
    cy.get('[data-cy="no-columns-found-message"]')
      .should('be.visible')
      .and('contain', 'NONEXISTENT');
  });

  it('should edit a column while filtered', () => {
    cy.spy(useDataStore.getState().actions, 'userUpdatesColumnDescription').as(
      'userUpdatesColumnDescription'
    );
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="search-filter-input"]').type('another');
    cy.get('[data-cy="search-filter-counter"]').should('contain', '1 of 4');

    cy.get('[data-cy="2-description"]').type(
      '{selectall}{backspace}Edited description while filtered'
    );

    cy.get('@userUpdatesColumnDescription').should(
      'have.been.calledWith',
      '2',
      'Edited description while filtered'
    );

    cy.get('[data-cy="search-filter-clear"]').click();
    cy.get('[data-cy="search-filter-counter"]').should('contain', '4 of 4');
  });

  it('should bulk assign data types to selected columns', () => {
    cy.spy(useDataStore.getState().actions, 'userUpdatesMultipleColumnDataTypes').as(
      'userUpdatesMultipleColumnDataTypes'
    );
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="1-column-annotation-card"]').click({ shiftKey: false, ctrlKey: false });
    cy.get('[data-cy="2-column-annotation-card"]').click({ shiftKey: false, ctrlKey: true });

    cy.get('[data-cy="bulk-assign-continuous"]').click();
    cy.get('@userUpdatesMultipleColumnDataTypes').should(
      'have.been.calledWith',
      ['1', '2'],
      DataType.continuous
    );

    cy.get('[data-cy="bulk-assign-none"]').click();
    cy.get('@userUpdatesMultipleColumnDataTypes').should('have.been.calledWith', ['1', '2'], null);

    cy.get('[data-cy="bulk-assign-categorical"]').click();
    cy.get('@userUpdatesMultipleColumnDataTypes').should(
      'have.been.calledWith',
      ['1', '2'],
      DataType.categorical
    );

    cy.get('[data-cy="clear-selection-button"]').click();
    cy.get('[data-cy="action-bar"]').should('contain', '0 columns selected');
  });

  it('should bulk assign standardized variable to selected columns from sidebar', () => {
    cy.spy(useDataStore.getState().actions, 'userUpdatesMultipleColumnStandardizedVariables').as(
      'userUpdatesMultipleColumnStandardizedVariables'
    );
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="1-column-annotation-card"]').click({ shiftKey: false, ctrlKey: false });
    cy.get('[data-cy="2-column-annotation-card"]').click({ shiftKey: false, ctrlKey: true });

    cy.get('[data-cy="standardized-variable-item-nb:Diagnosis"]').click();

    cy.get('@userUpdatesMultipleColumnStandardizedVariables').should(
      'have.been.calledWith',
      ['1', '2'],
      'nb:Diagnosis'
    );
  });

  it('should bulk assign collection term to selected columns from sidebar', () => {
    cy.spy(useDataStore.getState().actions, 'userUpdatesMultipleColumnToCollectionMappings').as(
      'userUpdatesMultipleColumnToCollectionMappings'
    );
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="1-column-annotation-card"]').click({ shiftKey: false, ctrlKey: false });
    cy.get('[data-cy="3-column-annotation-card"]').click({ shiftKey: false, ctrlKey: true });

    cy.get('[data-cy="collection-term-item-snomed:1304062007"]').click();

    cy.get('@userUpdatesMultipleColumnToCollectionMappings').should(
      'have.been.calledWith',
      ['1', '3'],
      'snomed:1304062007'
    );
  });

  it('should disable single-column variables when multiple columns are selected', () => {
    cy.spy(useDataStore.getState().actions, 'userUpdatesMultipleColumnStandardizedVariables').as(
      'userUpdatesMultipleColumnStandardizedVariables'
    );
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="1-column-annotation-card"]').click({ shiftKey: false, ctrlKey: false });
    cy.get('[data-cy="2-column-annotation-card"]').click({ shiftKey: false, ctrlKey: true });

    cy.get('[data-cy="standardized-variable-item-nb:Sex"]').should(
      'have.attr',
      'aria-disabled',
      'true'
    );

    cy.get('[data-cy="standardized-variable-item-nb:Sex"]').click({ force: true });

    cy.get('@userUpdatesMultipleColumnStandardizedVariables').should('not.have.been.called');

    cy.get('[data-cy="2-column-annotation-card"]').click({ shiftKey: false, ctrlKey: true });

    cy.get('[data-cy="standardized-variable-item-nb:Sex"]').should(
      'not.have.attr',
      'aria-disabled',
      'true'
    );

    cy.get('[data-cy="standardized-variable-item-nb:Sex"]').click();

    cy.get('@userUpdatesMultipleColumnStandardizedVariables').should(
      'have.been.calledWith',
      ['1'],
      'nb:Sex'
    );
  });
});
