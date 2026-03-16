import ColumnAnnotationCard from '../../src/components/ColumnAnnotationCard';
import { DataType } from '../../src/utils/internal_types';

const props = {
  id: '1',
  name: 'some header',
  description: 'some description',
  dataType: 'Categorical' as DataType,
  standardizedVariableId: 'nb:ParticipantID',
  standardizedVariableOptions: [
    {
      id: 'nb:ParticipantID',
      label: 'Participant ID',
      disabled: true,
      variable_type: 'identifier',
    },
    { id: 'nb:Sex', label: 'Sex', disabled: true, variable_type: 'continuous' },
    { id: 'nb:Age', label: 'Age', disabled: false, variable_type: 'continuous' },
    { id: 'nb:Assessment', label: 'Assessment Tool', disabled: false, variable_type: 'collection' },
  ],
  inferredDataTypeLabel: null,
  onDescriptionChange: () => {},
  onSelect: () => {},
};

describe('ColumnAnnotationCard', () => {
  it('should render the component with mapped values', () => {
    cy.mount(
      <ColumnAnnotationCard
        id={props.id}
        name={props.name}
        description={props.description}
        dataType={props.dataType}
        standardizedVariableId={props.standardizedVariableId}
        standardizedVariableOptions={props.standardizedVariableOptions}
        inferredDataTypeLabel={props.inferredDataTypeLabel}
        onDescriptionChange={props.onDescriptionChange}
        onSelect={props.onSelect}
      />
    );
    cy.get('[data-cy="1-column-annotation-card"]')
      .should('be.visible')
      .and('contain', 'some header');
    cy.get('[data-cy="1-description"]').should('be.visible').and('contain', 'some description');

    cy.get('[data-cy="1-column-annotation-card-data-type"]')
      .should('be.visible')
      .and('contain', 'Categorical');

    cy.get('[data-cy="1-column-annotation-card-mapped-variable"]')
      .should('be.visible')
      .and('contain', 'Participant ID');
  });

  it('should render placeholders for unmapped columns', () => {
    cy.mount(
      <ColumnAnnotationCard
        id={props.id}
        name={props.name}
        description={props.description}
        dataType={null}
        standardizedVariableId={null}
        standardizedVariableOptions={props.standardizedVariableOptions}
        inferredDataTypeLabel={null}
        onDescriptionChange={props.onDescriptionChange}
        onSelect={props.onSelect}
      />
    );
    cy.get('[data-cy="1-column-annotation-card-data-type-unassigned"]')
      .should('be.visible')
      .and('contain', 'Map to data type');

    cy.get('[data-cy="1-column-annotation-card-mapped-variable-unassigned"]')
      .should('be.visible')
      .and('contain', 'Map to standardized variable');
  });

  it('should fire the onDescriptionChange event handler with the appropriate payload when description is auto-saved', () => {
    const spy = cy.spy().as('spy');
    cy.mount(
      <ColumnAnnotationCard
        id={props.id}
        name={props.name}
        description={props.description}
        dataType={props.dataType}
        standardizedVariableId={props.standardizedVariableId}
        standardizedVariableOptions={props.standardizedVariableOptions}
        inferredDataTypeLabel={props.inferredDataTypeLabel}
        onDescriptionChange={spy}
        onSelect={props.onSelect}
      />
    );
    cy.get('[data-cy="1-description"]').should('be.visible');
    cy.get('[data-cy="1-description"] textarea').first().clear();
    cy.get('[data-cy="1-description"]').type('new description');
    cy.get('@spy').should('have.been.calledWith', '1', 'new description');
  });

  it('should show identifier label when data type is locked/inferred by standardized variable', () => {
    cy.mount(
      <ColumnAnnotationCard
        id="2"
        name="Identifier Column"
        description={null}
        dataType={null}
        standardizedVariableId="nb:ParticipantID"
        standardizedVariableOptions={props.standardizedVariableOptions}
        inferredDataTypeLabel="Identifier"
        onDescriptionChange={props.onDescriptionChange}
        onSelect={props.onSelect}
      />
    );

    cy.get('[data-cy="2-column-annotation-card-data-type"]').should('contain', 'Identifier');
  });

  it('should call onClearMapping and prevent card selection when the clear mapped variable button is clicked', () => {
    const onSelectSpy = cy.spy().as('onSelectSpy');
    const onClearMappingSpy = cy.spy().as('onClearMappingSpy');
    cy.mount(
      <ColumnAnnotationCard {...props} onSelect={onSelectSpy} onClearMapping={onClearMappingSpy} />
    );

    cy.get('[data-cy="1-clear-mapped-variable"]').should('be.visible').click();
    cy.get('@onClearMappingSpy').should('have.been.calledWith', '1');
    // Ensure that clicking the clear button doesn't bubble up and accidentally select the card
    cy.get('@onSelectSpy').should('not.have.been.called');
  });

  it('should call onClearDataType and prevent card selection when the clear data type button is clicked', () => {
    const onSelectSpy = cy.spy().as('onSelectSpy');
    const onClearDataTypeSpy = cy.spy().as('onClearDataTypeSpy');
    cy.mount(
      <ColumnAnnotationCard
        {...props}
        onSelect={onSelectSpy}
        onClearDataType={onClearDataTypeSpy}
      />
    );

    cy.get('[data-cy="1-clear-data-type"]').should('be.visible').click();
    cy.get('@onClearDataTypeSpy').should('have.been.calledWith', '1');
    // Ensure that clicking the clear button doesn't bubble up and accidentally select the card
    cy.get('@onSelectSpy').should('not.have.been.called');
  });

  it('should fire the onSelect event handler when the card is clicked', () => {
    const spy = cy.spy().as('onSelectSpy');
    cy.mount(
      <ColumnAnnotationCard
        id={props.id}
        name={props.name}
        description={props.description}
        dataType={props.dataType}
        standardizedVariableId={props.standardizedVariableId}
        standardizedVariableOptions={props.standardizedVariableOptions}
        inferredDataTypeLabel={props.inferredDataTypeLabel}
        onDescriptionChange={props.onDescriptionChange}
        onSelect={spy}
      />
    );
    cy.get('[data-cy="1-column-annotation-card"]').click();
    cy.get('@onSelectSpy').should('have.been.called');
  });

  it('should visually reflect the selected state via the checkbox', () => {
    cy.mount(<ColumnAnnotationCard {...props} selected={false} />);
    cy.get('[data-cy="1-column-annotation-card-checkbox"] input').should('not.be.checked');

    cy.mount(<ColumnAnnotationCard {...props} selected />);
    cy.get('[data-cy="1-column-annotation-card-checkbox"] input').should('be.checked');
  });

  it('should prevent card selection (onSelect) and fire onToggleCheckbox when the checkbox is clicked', () => {
    const onSelectSpy = cy.spy().as('onSelectSpy');
    const onToggleCheckboxSpy = cy.spy().as('onToggleCheckboxSpy');
    cy.mount(
      <ColumnAnnotationCard
        {...props}
        onSelect={onSelectSpy}
        onToggleCheckbox={onToggleCheckboxSpy}
      />
    );
    // Click the actual input element of the Checkbox
    cy.get('[data-cy="1-column-annotation-card-checkbox"] input').click();

    // onToggleCheckbox should be called (via onChange)
    cy.get('@onToggleCheckboxSpy').should('have.been.called');

    // The main card selection (onSelect) should NOT be called due to stopPropagation
    cy.get('@onSelectSpy').should('not.have.been.called');
  });
});
