import ColumnAnnotationCard from '../../src/components/ColumnAnnotationCard';
import { mockStandardizedVariables } from '../../src/utils/mocks';

const props = {
  id: 1,
  header: 'some header',
  description: 'some description',
  dataType: 'Categorical' as 'Categorical' | 'Continuous' | null,
  standardizedVariable: { identifier: 'participant_id', label: 'Participant ID' },
  standardizedVariableOptions: mockStandardizedVariables,
  onDescriptionChange: () => {},
  onDataTypeChange: () => {},
  onStandardizedVariableChange: () => {},
};

describe('ColumnAnnotationCard', () => {
  beforeEach(() => {
    cy.mount(
      <ColumnAnnotationCard
        id={props.id}
        header={props.header}
        description={props.description}
        dataType={props.dataType}
        standardizedVariable={props.standardizedVariable}
        standardizedVariableOptions={props.standardizedVariableOptions}
        onDescriptionChange={props.onDescriptionChange}
        onDataTypeChange={props.onDataTypeChange}
        onStandardizedVariableChange={props.onStandardizedVariableChange}
      />
    );
  });
  it('renders the component', () => {
    cy.get('[data-cy="1-column-annotation-card"]')
      .should('be.visible')
      .and('contain', 'some header');
    cy.get('[data-cy="1-description"]').should('be.visible').and('contain', 'some description');
    cy.get('[data-cy="1-edit-description-button"]').should('be.visible');
    cy.get('[data-cy="1-edit-description-button"]').click();
    cy.get('[data-cy="1-description-input"]')
      .should('be.visible')
      .and('contain', 'some description');
    cy.get('[data-cy="1-save-description-button"]').should('be.visible');
    cy.get('[data-cy="1-column-annotation-card-data-type"]').should('be.visible');
    cy.get('[data-cy="1-column-annotation-card-data-type-categorical-button"]')
      .should('be.visible')
      .and('contain', 'Categorical');
    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]')
      .should('be.visible')
      .and('contain', 'Continuous');
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"] input')
      .should('be.visible')
      .and('have.value', 'Participant ID');
  });
  it('Fires the onDescriptionChange event handler with the appropriate payload when the save button is clicked', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ColumnAnnotationCard
        id={props.id}
        header={props.header}
        description={props.description}
        dataType={props.dataType}
        standardizedVariable={props.standardizedVariable}
        standardizedVariableOptions={props.standardizedVariableOptions}
        onDescriptionChange={spy}
        onDataTypeChange={props.onDataTypeChange}
        onStandardizedVariableChange={props.onStandardizedVariableChange}
      />
    );
    cy.get('[data-cy="1-edit-description-button"]').click();
    cy.get('[data-cy="1-description-input"]').clear();
    cy.get('[data-cy="1-description-input"]').type('new description');
    cy.get('[data-cy="1-save-description-button"]').click();
    cy.get('@spy').should('have.been.calledWith', 1, 'new description');
  });
  it('Fires the onDataTypeChange event handler with the appropriate payload when the data type is toggled', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ColumnAnnotationCard
        id={props.id}
        header={props.header}
        description={props.description}
        dataType={props.dataType}
        standardizedVariable={props.standardizedVariable}
        standardizedVariableOptions={props.standardizedVariableOptions}
        onDescriptionChange={props.onDescriptionChange}
        onDataTypeChange={spy}
        onStandardizedVariableChange={props.onStandardizedVariableChange}
      />
    );
    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').click();
    cy.get('@spy').should('have.been.calledWith', 1, 'Continuous');
  });
  it('Fires the onStandardizedVariableChange event handler with the appropriate payload when the standardized variable is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ColumnAnnotationCard
        id={props.id}
        header={props.header}
        description={props.description}
        dataType={props.dataType}
        standardizedVariable={props.standardizedVariable}
        standardizedVariableOptions={props.standardizedVariableOptions}
        onDescriptionChange={props.onDescriptionChange}
        onDataTypeChange={props.onDataTypeChange}
        onStandardizedVariableChange={spy}
      />
    );
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"]').type(
      'age{downarrow}{enter}'
    );
    cy.get('@spy').should('have.been.calledWith', 1, { identifier: 'nb:Age', label: 'Age' });
  });
});
