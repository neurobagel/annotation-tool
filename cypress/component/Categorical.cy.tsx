import Categorical from '../../src/components/Categorical';
import useDataStore from '../../src/stores/data';

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
  beforeEach(() => {
    useDataStore.setState({
      termOptions: {
        'nb:Diagnosis': [{ label: 'test', identifier: 'test' }],
      },
    });
  });
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
  it('fires the onUpdateLevelTerm event handler with the appropriate payload when the level term is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <Categorical
        columnID={props.columnID}
        uniqueValues={props.uniqueValues}
        missingValues={props.missingValues}
        standardizedVariable={props.standardizedVariable}
        levels={props.levels}
        onUpdateDescription={props.onUpdateDescription}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateLevelTerm={spy}
      />
    );
    cy.get('[data-cy="3-F-term-dropdown"]').type('test{downArrow}{Enter}');
    cy.get('@spy').should('have.been.calledWith', '3', 'F', {
      identifier: 'test',
      label: 'test',
    });
  });
});
