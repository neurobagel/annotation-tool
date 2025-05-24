import Categorical from '../../src/components/Categorical';

const props = {
  columnID: '3',
  uniqueValues: ['F', 'M'],
  levels: {
    F: { description: 'Female' },
    M: { description: 'Male' },
  },
  missingValues: [],
  standardizedVariable: {
    identifier: 'nb:Diagnosis',
    label: 'Diagnosis',
  },
  onUpdateDescription: () => {},
  onToggleMissingValue: () => {},
  onUpdateLevelTerm: () => {},
};

describe('Categorical', () => {
  it('renders the component correctly', () => {
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        standardizedVariable={props.standardizedVariable}
        levels={props.levels}
        onUpdateDescription={props.onUpdateDescription}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="3-categorical"]').should('be.visible');
    cy.get('[data-cy="3-categorical-table-head"]')
      .should('be.visible')
      .and('contain', 'Value')
      .and('contain', 'Description');
    cy.get('[data-cy="3-F"]').should('be.visible').and('contain', 'F');
    cy.get('[data-cy="3-F-description"]').should('be.visible').and('contain', 'Female');
    cy.get('[data-cy="3-F-edit-description-button"]').should('be.visible');
  });
  it('fires the onUpdateDescription event handler with the appropriate payload when the description is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        standardizedVariable={props.standardizedVariable}
        levels={props.levels}
        onUpdateDescription={spy}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="3-F-edit-description-button"]').click();
    cy.get('[data-cy="3-F-description-input"]').clear();
    cy.get('[data-cy="3-F-description-input"]').type('new description');
    cy.get('[data-cy="3-F-save-description-button"]').click();
    cy.get('@spy').should('have.been.calledWith', '3', 'F', 'new description');
  });
});
