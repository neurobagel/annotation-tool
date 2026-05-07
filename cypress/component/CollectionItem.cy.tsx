import CollectionItem from '../../src/components/CollectionItem';
import { StandardizedVariableItem } from '../../src/utils/internal_types';

const mockVariable: StandardizedVariableItem = {
  id: 'nb:mockVariable',
  label: 'Mock Variable Name',
  can_have_multiple_columns: true,
  terms: [
    {
      id: 'nb:termOne',
      label: 'Stroop Color-Word Test',
    },
    {
      id: 'nb:termTwo',
      label: 'Questionnaire for Psychotic Experiences',
      abbreviation: 'QPE',
    },
    {
      id: 'nb:termThree',
      label: 'Questionnaire for Psychotic Experiences; hallucinations_psychosis',
    },
    {
      id: 'nb:termFour',
      label: 'Some Unrelated Term',
    },
  ],
};

const props = {
  variable: mockVariable,
  onTermSelect: () => {},
};

describe('CollectionItem', () => {
  it('should render the component correctly with label and search input', () => {
    cy.mount(
      <CollectionItem
        variable={props.variable}
        onTermSelect={props.onTermSelect}
        totalCollectionMappedCount={0}
        mappedTermCounts={{}}
      />
    );
    cy.get('h6').contains('Mock Variable Name').should('be.visible');
    cy.get('[data-cy="search-terms-input"]').should('be.visible');
    cy.get('[data-cy^="collection-term-item-"]').should('have.length', 4);
  });

  it('should render the terms with correctly parsed labels, combining abbreviations, and visual dividers', () => {
    cy.mount(
      <CollectionItem
        variable={props.variable}
        onTermSelect={props.onTermSelect}
        totalCollectionMappedCount={0}
        mappedTermCounts={{}}
      />
    );
    cy.get('[data-cy="collection-term-item-nb:termOne"]').should(
      'contain',
      'Stroop Color-Word Test'
    );
    cy.get('[data-cy="collection-term-item-nb:termTwo"]').should(
      'contain',
      'QPE - Questionnaire for Psychotic Experiences'
    );

    // Verify that long terms naturally wrap and are fully displayed without truncation
    cy.get('[data-cy="collection-term-item-nb:termThree"]').within(() => {
      cy.contains('Questionnaire for Psychotic Experiences; hallucinations_psychosis').should(
        ($el) => {
          const element = $el?.[0] as unknown as HTMLElement;
          // scrollWidth should not exceed clientWidth, meaning it's wrapped and not overflowing horizontally
          expect(element?.scrollWidth).to.be.at.most(element?.clientWidth);
          // It shouldn't be using CSS truncation
          expect($el).to.not.have.css('text-overflow', 'ellipsis');
          expect($el).to.not.have.css('white-space', 'nowrap');
        }
      );
    });

    cy.get('hr.MuiDivider-root').should('be.visible');
  });

  describe('fuzzy search filtering', () => {
    it('should filter terms based on fuzzy matching the label text', () => {
      cy.mount(
        <CollectionItem
          variable={props.variable}
          onTermSelect={props.onTermSelect}
          totalCollectionMappedCount={0}
          mappedTermCounts={{}}
        />
      );

      cy.get('[data-cy="search-terms-input"]').type('Stroop');
      cy.get('[data-cy^="collection-term-item-"]').should('have.length', 1);
      cy.get('[data-cy="collection-term-item-nb:termOne"]').should('be.visible');

      cy.get('[data-cy="search-terms-input"]').find('button').click();
      cy.get('[data-cy^="collection-term-item-"]').should('have.length', 4);

      cy.get('[data-cy="search-terms-input"]').type('QPE');
      cy.get('[data-cy^="collection-term-item-"]').should('have.length', 1);
      cy.get('[data-cy="collection-term-item-nb:termTwo"]').should('be.visible');
    });

    it('should match terms effectively containing multiple word substrings', () => {
      cy.mount(
        <CollectionItem
          variable={props.variable}
          onTermSelect={props.onTermSelect}
          totalCollectionMappedCount={0}
          mappedTermCounts={{}}
        />
      );

      cy.get('[data-cy="search-terms-input"]').type('Psychotic');
      cy.get('[data-cy^="collection-term-item-"]').should('have.length', 2);
      cy.get('[data-cy="collection-term-item-nb:termTwo"]').should('be.visible');
      cy.get('[data-cy="collection-term-item-nb:termThree"]').should('be.visible');
    });

    it('should display a "No terms found" message when query has zero matches', () => {
      cy.mount(
        <CollectionItem
          variable={props.variable}
          onTermSelect={props.onTermSelect}
          totalCollectionMappedCount={0}
          mappedTermCounts={{}}
        />
      );

      cy.get('[data-cy="search-terms-input"]').type('XYZ Nonexistent Term');
      cy.get('[data-cy^="collection-term-item-"]').should('not.exist');
      cy.contains('No terms found matching "XYZ Nonexistent Term"').should('be.visible');
    });
  });

  it('should fire the onTermSelect event handler with the appropriate payload when a term is clicked', () => {
    const onTermSelect = cy.stub().as('onTermSelect');
    cy.mount(
      <CollectionItem
        variable={props.variable}
        onTermSelect={onTermSelect}
        totalCollectionMappedCount={0}
        mappedTermCounts={{}}
      />
    );

    cy.get('[data-cy="collection-term-item-nb:termTwo"]').click();
    cy.get('@onTermSelect').should('have.been.calledWith', 'nb:termTwo');
  });

  it('should disable the component if it lacks multiple selection capability', () => {
    const multipleSelectionVariable = {
      ...mockVariable,
      can_have_multiple_columns: false,
    };

    cy.mount(
      <CollectionItem
        variable={multipleSelectionVariable}
        onTermSelect={props.onTermSelect}
        hasMultipleSelection
        totalCollectionMappedCount={0}
        mappedTermCounts={{}}
      />
    );

    cy.get('[data-cy="collection-item-nb:mockVariable"]')
      .should('be.visible')
      .and('have.attr', 'aria-disabled', 'true');
  });

  it('should render numeric badge for total collection mapped count', () => {
    cy.mount(
      <CollectionItem
        variable={props.variable}
        onTermSelect={props.onTermSelect}
        totalCollectionMappedCount={8}
        mappedTermCounts={{}}
      />
    );

    cy.get('[data-cy="mapped-count-badge-nb:mockVariable"]')
      .should('be.visible')
      .and('contain', '8');
  });

  it('should render numeric badges for individual term mapped counts', () => {
    const mappedTermCounts = {
      'nb:termOne': 2,
      'nb:termTwo': 6,
    };
    cy.mount(
      <CollectionItem
        variable={props.variable}
        onTermSelect={props.onTermSelect}
        totalCollectionMappedCount={0}
        mappedTermCounts={mappedTermCounts}
      />
    );

    cy.get('[data-cy="mapped-count-badge-term-nb:termOne"]')
      .should('be.visible')
      .and('contain', '2');
    cy.get('[data-cy="mapped-count-badge-term-nb:termTwo"]')
      .should('be.visible')
      .and('contain', '6');

    cy.get('[data-cy="mapped-count-badge-term-nb:termThree"]').should('not.exist');
  });
});
