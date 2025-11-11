import { DataType } from '../../datamodel';
import ColumnAnnotationCard from '../../src/components/ColumnAnnotationCard';

const props = {
  id: '1',
  name: 'some header',
  description: 'some description',
  dataType: 'Categorical' as DataType,
  standardizedVariableId: 'nb:ParticipantID',
  standardizedVariableOptions: [
    { id: 'nb:ParticipantID', label: 'Participant ID', disabled: true },
    { id: 'nb:Sex', label: 'Sex', disabled: true },
    { id: 'nb:Age', label: 'Age', disabled: false },
    { id: 'nb:Assessment', label: 'Assessment Tool', disabled: false },
  ],
  isDataTypeEditable: true,
  lockedDataTypeLabel: null,
  onDescriptionChange: () => {},
  onDataTypeChange: () => {},
  onStandardizedVariableChange: () => {},
};

describe('ColumnAnnotationCard', () => {
  beforeEach(() => {
    cy.mount(
      <ColumnAnnotationCard
        id={props.id}
        name={props.name}
        description={props.description}
        dataType={props.dataType}
        standardizedVariableId={props.standardizedVariableId}
        standardizedVariableOptions={props.standardizedVariableOptions}
        isDataTypeEditable={props.isDataTypeEditable}
        inferredDataTypeLabel={props.lockedDataTypeLabel}
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
  it('Fires the onDescriptionChange event handler with the appropriate payload when description is auto-saved', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ColumnAnnotationCard
        id={props.id}
        name={props.name}
        description={props.description}
        dataType={props.dataType}
        standardizedVariableId={props.standardizedVariableId}
        standardizedVariableOptions={props.standardizedVariableOptions}
        isDataTypeEditable={props.isDataTypeEditable}
        inferredDataTypeLabel={props.lockedDataTypeLabel}
        onDescriptionChange={spy}
        onDataTypeChange={props.onDataTypeChange}
        onStandardizedVariableChange={props.onStandardizedVariableChange}
      />
    );
    cy.get('[data-cy="1-description"]').should('be.visible');
    cy.get('[data-cy="1-description"] textarea').first().clear();
    cy.get('[data-cy="1-description"]').type('new description');
    cy.get('@spy').should('have.been.calledWith', '1', 'new description');
  });
  it('Fires the onDataTypeChange event handler with the appropriate payload when the data type is toggled', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ColumnAnnotationCard
        id={props.id}
        name={props.name}
        description={props.description}
        dataType={props.dataType}
        standardizedVariableId={props.standardizedVariableId}
        standardizedVariableOptions={props.standardizedVariableOptions}
        isDataTypeEditable={props.isDataTypeEditable}
        onDescriptionChange={props.onDescriptionChange}
        onDataTypeChange={spy}
        onStandardizedVariableChange={props.onStandardizedVariableChange}
        inferredDataTypeLabel={props.lockedDataTypeLabel}
      />
    );
    cy.get('[data-cy="1-column-annotation-card-data-type-continuous-button"]').click();
    cy.get('@spy').should('have.been.calledWith', '1', 'Continuous');
  });
  it('Fires the onStandardizedVariableChange event handler with the appropriate payload when the standardized variable is changed', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ColumnAnnotationCard
        id={props.id}
        name={props.name}
        description={props.description}
        dataType={props.dataType}
        standardizedVariableId={props.standardizedVariableId}
        standardizedVariableOptions={props.standardizedVariableOptions}
        isDataTypeEditable={props.isDataTypeEditable}
        onDescriptionChange={props.onDescriptionChange}
        onDataTypeChange={props.onDataTypeChange}
        onStandardizedVariableChange={spy}
        inferredDataTypeLabel={props.lockedDataTypeLabel}
      />
    );
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"]').type(
      'age{downarrow}{enter}'
    );
    cy.get('@spy').should('have.been.calledWith', '1', 'nb:Age');
  });

  it('Cannot assign single-column standardized variables twice', () => {
    cy.get('[data-cy="1-column-annotation-card-standardized-variable-dropdown"]').click();

    // Verify that "Participant ID" and "Sex" option are disabled (should have aria-disabled="true")
    cy.get('[role="listbox"]').should('be.visible');
    cy.get('[role="option"]')
      .contains('Participant ID')
      .should('have.attr', 'aria-disabled', 'true');
    cy.get('[role="option"]').contains('Sex').should('have.attr', 'aria-disabled', 'true');

    // Verify that other options like "Age" are still enabled
    cy.get('[role="option"]').contains('Age').should('not.have.attr', 'aria-disabled', 'true');
  });

  it('shows identifier label when data type is locked by standardized variable', () => {
    cy.mount(
      <ColumnAnnotationCard
        id="2"
        name="Identifier Column"
        description={null}
        dataType={null}
        standardizedVariableId="nb:ParticipantID"
        standardizedVariableOptions={props.standardizedVariableOptions}
        isDataTypeEditable={false}
        inferredDataTypeLabel="Identifier"
        onDescriptionChange={props.onDescriptionChange}
        onDataTypeChange={props.onDataTypeChange}
        onStandardizedVariableChange={props.onStandardizedVariableChange}
      />
    );

    cy.get('[data-cy="2-column-annotation-card-data-type"]').should('contain', 'Identifier');
  });
});
