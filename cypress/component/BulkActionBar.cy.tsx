import BulkActionBar from '../../src/components/BulkActionBar';
import { DataType } from '../../src/utils/internal_types';

const props = {
  onClearSelection: () => {},
  onAssignDataType: () => {},
};

describe('BulkActionBar', () => {
  it('should render the component correctly when no columns are selected', () => {
    cy.mount(
      <BulkActionBar
        selectedCount={0}
        onClearSelection={props.onClearSelection}
        onAssignDataType={props.onAssignDataType}
      />
    );

    cy.get('[data-cy="action-bar"]').should('be.visible').and('contain', '0 columns selected');
    cy.get('[data-cy="clear-selection-button"]').should('be.disabled');
    cy.get('[data-cy="bulk-assign-categorical"]').should('be.disabled');
    cy.get('[data-cy="bulk-assign-continuous"]').should('be.disabled');
    cy.get('[data-cy="bulk-assign-none"]').should('be.disabled');
  });

  it('should render the component correctly with selected columns and enable buttons', () => {
    cy.mount(
      <BulkActionBar
        selectedCount={2}
        onClearSelection={props.onClearSelection}
        onAssignDataType={props.onAssignDataType}
      />
    );

    cy.get('[data-cy="action-bar"]').should('be.visible').and('contain', '2 columns selected');
    cy.get('[data-cy="clear-selection-button"]').should('not.be.disabled');
    cy.get('[data-cy="bulk-assign-categorical"]').should('not.be.disabled');
    cy.get('[data-cy="bulk-assign-continuous"]').should('not.be.disabled');
    cy.get('[data-cy="bulk-assign-none"]').should('not.be.disabled');
  });

  it('should call onClearSelection with appropriate payload when clear button is clicked', () => {
    const onClearSelection = cy.stub().as('onClearSelection');

    cy.mount(
      <BulkActionBar
        selectedCount={3}
        onClearSelection={onClearSelection}
        onAssignDataType={props.onAssignDataType}
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
        onAssignDataType={onAssignDataType}
      />
    );

    cy.get('[data-cy="bulk-assign-categorical"]').click();
    cy.get('@onAssignDataType').should('have.been.calledWith', DataType.categorical);

    cy.get('[data-cy="bulk-assign-continuous"]').click();
    cy.get('@onAssignDataType').should('have.been.calledWith', DataType.continuous);

    cy.get('[data-cy="bulk-assign-none"]').click();
    cy.get('@onAssignDataType').should('have.been.calledWith', null);
  });
});
