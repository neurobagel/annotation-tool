import BulkActionBar from '../../src/components/BulkActionBar';
import { DataType } from '../../src/utils/internal_types';

const props = {
  onClearSelection: () => {},
  onAssignDataType: () => {},
  onClearMappings: () => {},
  hideAnnotated: false,
  onHideAnnotatedChange: () => {},
};

describe('BulkActionBar', () => {
  it('should disable all buttons when no columns are selected', () => {
    cy.mount(
      <BulkActionBar
        selectedCount={0}
        onClearSelection={props.onClearSelection}
        onAssignDataType={props.onAssignDataType}
        onClearMappings={props.onClearMappings}
        hideAnnotated={props.hideAnnotated}
        onHideAnnotatedChange={props.onHideAnnotatedChange}
      />
    );

    cy.get('[data-cy="action-bar"]').should('be.visible').and('contain', '0 columns selected');
    cy.get('[data-cy="clear-selection-button"]').should('be.disabled');
    cy.get('[data-cy="bulk-assign-categorical"]').should('be.disabled');
    cy.get('[data-cy="bulk-assign-continuous"]').should('be.disabled');
    cy.get('[data-cy="bulk-assign-none"]').should('be.disabled');
    cy.get('[data-cy="bulk-unassign-mappings"]').should('be.disabled');
    cy.get('[data-cy="hide-annotated-toggle"]').should('be.visible');
  });

  it('should enable all buttons when at least 1 column is selected', () => {
    cy.mount(
      <BulkActionBar
        selectedCount={2}
        onClearSelection={props.onClearSelection}
        onAssignDataType={props.onAssignDataType}
        onClearMappings={props.onClearMappings}
        hasMappedSelected
        hideAnnotated={props.hideAnnotated}
        onHideAnnotatedChange={props.onHideAnnotatedChange}
      />
    );

    cy.get('[data-cy="action-bar"]').should('be.visible').and('contain', '2 columns selected');
    cy.get('[data-cy="clear-selection-button"]').should('not.be.disabled');
    cy.get('[data-cy="bulk-assign-categorical"]').should('not.be.disabled');
    cy.get('[data-cy="bulk-assign-continuous"]').should('not.be.disabled');
    cy.get('[data-cy="bulk-assign-none"]').should('not.be.disabled');
    cy.get('[data-cy="bulk-unassign-mappings"]').should('not.be.disabled');
  });

  it('should leave clear mappings disabled when columns are selected but none are mapped', () => {
    cy.mount(
      <BulkActionBar
        selectedCount={3}
        onClearSelection={props.onClearSelection}
        onAssignDataType={props.onAssignDataType}
        onClearMappings={props.onClearMappings}
        hideAnnotated={props.hideAnnotated}
        onHideAnnotatedChange={props.onHideAnnotatedChange}
      />
    );

    cy.get('[data-cy="action-bar"]').should('be.visible').and('contain', '3 columns selected');
    cy.get('[data-cy="clear-selection-button"]').should('not.be.disabled');
    cy.get('[data-cy="bulk-assign-categorical"]').should('not.be.disabled');
    cy.get('[data-cy="bulk-assign-continuous"]').should('not.be.disabled');
    cy.get('[data-cy="bulk-assign-none"]').should('not.be.disabled');
    cy.get('[data-cy="bulk-unassign-mappings"]').should('be.visible').and('be.disabled');
  });

  it('should call onClearSelection with appropriate payload when clear button is clicked', () => {
    const onClearSelection = cy.stub().as('onClearSelection');

    cy.mount(
      <BulkActionBar
        selectedCount={3}
        onAssignDataType={props.onAssignDataType}
        onClearMappings={props.onClearMappings}
        onClearSelection={onClearSelection}
        hideAnnotated={props.hideAnnotated}
        onHideAnnotatedChange={props.onHideAnnotatedChange}
      />
    );

    cy.get('[data-cy="clear-selection-button"]').click();
    cy.get('@onClearSelection').should('have.been.calledOnce');
  });

  it('should call onAssignDataType with appropriate payload when assignment buttons are clicked', () => {
    const onAssignDataType = cy.stub().as('onAssignDataType');

    cy.mount(
      <BulkActionBar
        selectedCount={1}
        onClearSelection={props.onClearSelection}
        onClearMappings={props.onClearMappings}
        onAssignDataType={onAssignDataType}
        hideAnnotated={props.hideAnnotated}
        onHideAnnotatedChange={props.onHideAnnotatedChange}
      />
    );

    cy.get('[data-cy="bulk-assign-categorical"]').click();
    cy.get('@onAssignDataType').should('have.been.calledWith', DataType.categorical);

    cy.get('[data-cy="bulk-assign-continuous"]').click();
    cy.get('@onAssignDataType').should('have.been.calledWith', DataType.continuous);

    cy.get('[data-cy="bulk-assign-none"]').click();
    cy.get('@onAssignDataType').should('have.been.calledWith', null);
  });

  it('should fire onClearMappings event handler with the appropriate payload when clear mappings button is clicked', () => {
    const onClearMappings = cy.stub().as('onClearMappings');

    cy.mount(
      <BulkActionBar
        selectedCount={1}
        onClearSelection={props.onClearSelection}
        onAssignDataType={props.onAssignDataType}
        hasMappedSelected
        onClearMappings={onClearMappings}
        hideAnnotated={props.hideAnnotated}
        onHideAnnotatedChange={props.onHideAnnotatedChange}
      />
    );

    cy.get('[data-cy="bulk-unassign-mappings"]').should('be.visible').and('not.be.disabled');
    cy.get('[data-cy="bulk-unassign-mappings"]').click();
    cy.get('@onClearMappings').should('have.been.calledOnce');
  });

  it('should fire onHideAnnotatedChange event handler with the appropriate payload when the switch is clicked', () => {
    const onHideAnnotatedChange = cy.stub().as('onHideAnnotatedChange');

    cy.mount(
      <BulkActionBar
        selectedCount={0}
        onClearSelection={props.onClearSelection}
        onAssignDataType={props.onAssignDataType}
        onClearMappings={props.onClearMappings}
        hideAnnotated={false}
        onHideAnnotatedChange={onHideAnnotatedChange}
      />
    );

    cy.get('[data-cy="hide-annotated-toggle"] input').should('not.be.checked');
    cy.get('[data-cy="hide-annotated-toggle"] input').check();
    cy.get('@onHideAnnotatedChange').should('have.been.calledWith', true);
  });
});
