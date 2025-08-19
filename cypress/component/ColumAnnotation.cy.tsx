import ColumnAnnotation from '../../src/components/ColumnAnnotation';
import useDataStore from '../../src/stores/data';

describe('ColumnAnnotation', () => {
  beforeEach(() => {
    useDataStore.setState({
      columns: {
        1: {
          header: 'some column',
          description: 'This is some column',
          bidsType: 'Categorical',
          standardizedVariable: { identifier: 'somevar', label: 'some variable' },
        },
        2: {
          header: 'another column',
          description: 'This is another column',
          bidsType: 'Continuous',
          standardizedVariable: null,
        },
      },
    });
  });

  it('renders the component correctly', () => {
    cy.mount(<ColumnAnnotation />);
    cy.get('[data-cy="1-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="1-description"]').should('be.visible').and('contain', 'This is some column');
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"] input')
      .should('be.visible')
      .and('have.value', 'some variable');
    cy.get('[data-cy="1-column-annotation-card-data-type-categorical-button"]')
      .should('be.visible')
      .and('have.class', 'Mui-selected');
    cy.get('[data-cy="2-column-annotation-card"]').should('be.visible');
    cy.get('[data-cy="2-description"]')
      .should('be.visible')
      .and('contain', 'This is another column');
    cy.get('[data-cy="2-column-annotation-card-standardized-variable-dropdown"] input')
      .should('be.visible')
      .and('have.value', '');
    cy.get('[data-cy="2-column-annotation-card-data-type-continuous-button"]')
      .should('be.visible')
      .and('have.class', 'Mui-selected');
  });
  it('edits the description', () => {
    cy.mount(<ColumnAnnotation />);
    cy.get('[data-cy="1-description"]').should('be.visible');
    cy.get('[data-cy="1-description"] textarea').first().clear();
    cy.get('[data-cy="1-description"]').type('new description');
    cy.get('[data-cy="1-description"]').should('contain', 'new description');
  });
  it('toggles the data type between categorical and continuous', () => {
    cy.mount(<ColumnAnnotation />);

    cy.get('[data-cy="1-column-annotation-card-data-type-categorical-button"]').should(
      'have.class',
      'Mui-selected'
    );
    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').should(
      'not.have.class',
      'Mui-selected'
    );

    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').click();

    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').should(
      'have.class',
      'Mui-selected'
    );
    cy.get('[data-cy="1-column-annotation-card-data-type-categorical-button"]').should(
      'not.have.class',
      'Mui-selected'
    );
  });
});
