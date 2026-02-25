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

  const getCard = (id: string) => cy.get(`[data-cy="${id}-column-annotation-card"]`);
  const getIndicator = () => cy.get('[data-cy="action-bar"]');
  const getContainer = () => cy.get('[data-cy="scrollable-container"]');

  it('should select a single column and clears others', () => {
    cy.mount(<ColumnAnnotation />);

    getCard('1').click('topLeft');
    getCard('1').should('have.class', 'bg-blue-50/50');
    getIndicator().should('contain', '1 column selected');

    getCard('2').click('topLeft');
    getCard('2').should('have.class', 'bg-blue-50/50');
    getCard('1').should('not.have.class', 'bg-blue-50/50');
  });

  it('should toggle selection with Ctrl/Cmd+click', () => {
    cy.mount(<ColumnAnnotation />);

    getCard('1').click('topLeft');
    getCard('2').click('topLeft', { ctrlKey: true });

    getCard('1').should('have.class', 'bg-blue-50/50');
    getCard('2').should('have.class', 'bg-blue-50/50');
    getIndicator().should('contain', '2 columns selected');

    getCard('1').click('topLeft', { ctrlKey: true });
    getCard('1').should('not.have.class', 'bg-blue-50/50');
    getCard('2').should('have.class', 'bg-blue-50/50');
    getIndicator().should('contain', '1 column selected');

    getCard('3').click('topLeft', { metaKey: true });
    getCard('2').should('have.class', 'bg-blue-50/50');
    getCard('3').should('have.class', 'bg-blue-50/50');
    getIndicator().should('contain', '2 columns selected');
  });

  it('should select a range with Shift+click', () => {
    cy.mount(<ColumnAnnotation />);

    getCard('2').click('topLeft');
    getCard('4').click('topLeft', { shiftKey: true });

    getCard('2').should('have.class', 'bg-blue-50/50');
    getCard('3').should('have.class', 'bg-blue-50/50');
    getCard('4').should('have.class', 'bg-blue-50/50');
    getIndicator().should('contain', '3 columns selected');

    getCard('2').click('topLeft', { shiftKey: true });
    getCard('2').should('have.class', 'bg-blue-50/50');
    getCard('3').should('not.have.class', 'bg-blue-50/50');
    getCard('4').should('not.have.class', 'bg-blue-50/50');
  });

  it('should clear selection when clicking outside', () => {
    cy.mount(<ColumnAnnotation />);

    getCard('1').click('topLeft');
    getCard('2').click('topLeft', { ctrlKey: true });
    getIndicator().should('contain', '2 columns selected');

    getContainer().click('topRight');

    getCard('1').should('not.have.class', 'bg-blue-50/50');
    getCard('2').should('not.have.class', 'bg-blue-50/50');
    getIndicator().should('not.exist');
  });

  it('should respect filtering when range selecting', () => {
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="search-filter-input"]').type('Col');

    getCard('1').click();

    cy.get('[data-cy="search-filter-input"] input').clear();
    cy.get('[data-cy="search-filter-input"] input').type('Col B');
    cy.get('[data-cy="search-filter-input"] input').clear();
    cy.get('[data-cy="search-filter-input"] input').type('Col');

    cy.get('[data-cy="search-filter-input"] input').clear();
    cy.get('[data-cy="search-filter-input"] input').type('C'); // Shows Col C

    getCard('3').should('be.visible');
  });

  it('should not select when interacting with inputs inside card', () => {
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="1-description"] textarea').first().click();
    getCard('1').should('not.have.class', 'bg-blue-50/50');

    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"]').click();
    getCard('1').should('not.have.class', 'bg-blue-50/50');
  });
});
