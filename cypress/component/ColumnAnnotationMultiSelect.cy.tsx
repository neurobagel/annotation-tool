import ColumnAnnotation from '../../src/components/ColumnAnnotation';
import { useDataStore } from '../../src/stores/data';
import { Columns } from '../../src/utils/internal_types';
import { mockStandardizedVariables } from '../../src/utils/mocks';

const createMockColumns = (): Columns => ({
  '1': {
    id: '1',
    name: 'Col A',
    description: '',
    dataType: null,
    standardizedVariable: null,
    allValues: [],
  },
  '2': {
    id: '2',
    name: 'Col B',
    description: '',
    dataType: null,
    standardizedVariable: null,
    allValues: [],
  },
  '3': {
    id: '3',
    name: 'Col C',
    description: '',
    dataType: null,
    standardizedVariable: null,
    allValues: [],
  },
  '4': {
    id: '4',
    name: 'Col D',
    description: '',
    dataType: null,
    standardizedVariable: null,
    allValues: [],
  },
  '5': {
    id: '5',
    name: 'Col E',
    description: '',
    dataType: null,
    standardizedVariable: null,
    allValues: [],
  },
});

describe('ColumnAnnotation Multi-Select functionality', () => {
  beforeEach(() => {
    useDataStore.setState({
      columns: createMockColumns(),
      standardizedVariables: mockStandardizedVariables,
    });
  });

  it('should clear previous selection when a single column is selected', () => {
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="1-column-annotation-card"]').click('topLeft');
    cy.get('[data-cy="1-column-annotation-card"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="action-bar"]').should('contain', '1 column selected');

    cy.get('[data-cy="2-column-annotation-card"]').click('topLeft');
    cy.get('[data-cy="2-column-annotation-card"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="1-column-annotation-card"]').should('have.attr', 'aria-selected', 'false');
  });

  it('should toggle selection with Ctrl/Cmd+click', () => {
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="1-column-annotation-card"]').click('topLeft');
    cy.get('[data-cy="2-column-annotation-card"]').click('topLeft', { ctrlKey: true });

    cy.get('[data-cy="1-column-annotation-card"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="2-column-annotation-card"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="action-bar"]').should('contain', '2 columns selected');

    cy.get('[data-cy="1-column-annotation-card"]').click('topLeft', { ctrlKey: true });
    cy.get('[data-cy="1-column-annotation-card"]').should('have.attr', 'aria-selected', 'false');
    cy.get('[data-cy="2-column-annotation-card"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="action-bar"]').should('contain', '1 column selected');

    cy.get('[data-cy="3-column-annotation-card"]').click('topLeft', { metaKey: true });
    cy.get('[data-cy="2-column-annotation-card"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="3-column-annotation-card"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="action-bar"]').should('contain', '2 columns selected');
  });

  it('should select a range with Shift+click', () => {
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="2-column-annotation-card"]').click('topLeft');
    cy.get('[data-cy="4-column-annotation-card"]').click('topLeft', { shiftKey: true });

    cy.get('[data-cy="2-column-annotation-card"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="3-column-annotation-card"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="4-column-annotation-card"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="action-bar"]').should('contain', '3 columns selected');

    cy.get('[data-cy="2-column-annotation-card"]').click('topLeft', { shiftKey: true });
    cy.get('[data-cy="2-column-annotation-card"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-cy="3-column-annotation-card"]').should('have.attr', 'aria-selected', 'false');
    cy.get('[data-cy="4-column-annotation-card"]').should('have.attr', 'aria-selected', 'false');
  });

  it('should show correct selected count in action bar', () => {
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="1-column-annotation-card"]').click('topLeft');
    cy.get('[data-cy="2-column-annotation-card"]').click('topLeft', { ctrlKey: true });

    cy.get('[data-cy="action-bar"]').should('contain', '2 columns selected');

    cy.get('[data-cy="search-filter-input"] input').clear();
    cy.get('[data-cy="search-filter-input"] input').type('Col C');

    cy.get('[data-cy="action-bar"]').should('contain', '2 columns selected');
  });
});
