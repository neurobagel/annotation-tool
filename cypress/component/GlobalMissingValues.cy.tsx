import GlobalMissingValues from '../../src/components/GlobalMissingValues';
import { useDataStore } from '../../src/stores/data';
import { DataType, type Columns } from '../../src/utils/internal_types';

const createColumns = (): Columns => ({
  '1': {
    id: '1',
    name: 'age',
    allValues: ['25', '30', 'N/A'],
    dataType: DataType.continuous,
    missingValues: [],
  },
  '2': {
    id: '2',
    name: 'sex',
    allValues: ['M', 'F', 'N/A', '-999', 'missing_value', '', ' ', '  ', 'n/a ', ' n/a'],
    dataType: DataType.categorical,
    missingValues: [],
  },
});

describe('GlobalMissingValues', () => {
  beforeEach(() => {
    useDataStore.getState().actions.reset();
    useDataStore.setState((state) => ({
      ...state,
      columns: createColumns(),
      globalMissingValues: [],
    }));
  });

  it('should render the component and show empty state', () => {
    cy.mount(<GlobalMissingValues />);
    cy.get('[data-cy="global-missing-values-description"]')
      .should('be.visible')
      .and('contain', 'Stage missing values');
    cy.get('[data-cy="global-missing-values-empty-state"]').should('be.visible');
  });

  it('should suggest missing values based on column allValues', () => {
    cy.mount(<GlobalMissingValues />);
    cy.contains('Suggested from your data:').should('be.visible');
    cy.get('[data-cy="global-missing-value-suggested-N/A"]').should('be.visible');
    cy.get('[data-cy="global-missing-value-suggested--999"]').should('be.visible');
  });

  it('should add a suggested missing value to the staging area', () => {
    cy.mount(<GlobalMissingValues />);
    cy.get('[data-cy="global-missing-value-suggested-N/A"]').click();

    cy.get('[data-cy="global-missing-value-suggested-N/A"]').should('not.exist');

    cy.get('[data-cy="global-missing-value-card-N/A"]').should('be.visible');
    cy.get('[data-cy="global-missing-value-N/A-description"]').should('be.visible');
  });

  it('should allow manually adding a missing value via input', () => {
    cy.mount(<GlobalMissingValues />);
    cy.get('[data-cy="global-missing-value-input"]').type('missing_value{enter}');

    cy.get('[data-cy="global-missing-value-card-missing_value"]').should('be.visible');
  });

  it('should display an error if entered value is not in any column', () => {
    cy.mount(<GlobalMissingValues />);
    cy.get('[data-cy="global-missing-value-input"]').type('invalid_value{enter}');

    cy.get('[data-cy="global-missing-value-card-invalid_value"]').should('not.exist');

    cy.get('[data-cy="global-missing-value-error-text"]')
      .should('be.visible')
      .and('contain', 'not found in dataset');
  });

  it('should update the description of a staged missing value', () => {
    cy.mount(<GlobalMissingValues />);
    cy.get('[data-cy="global-missing-value-suggested-N/A"]').click();

    cy.get('[data-cy="global-missing-value-N/A-description"]').type('Not Applicable');
    cy.get('[data-cy="global-missing-value-N/A-description"] textarea')
      .first()
      .should('have.value', 'Not Applicable');
  });

  it('should remove a missing value from the staging area but not trigger an apply', () => {
    cy.mount(<GlobalMissingValues />);
    cy.get('[data-cy="global-missing-value-suggested-N/A"]').click();

    cy.get('[data-cy="global-missing-value-delete-N/A"]').click();
    cy.get('[data-cy="global-missing-values-empty-state"]').should('be.visible');
    cy.get('[data-cy="global-missing-value-suggested-N/A"]').should('be.visible');
  });

  it('should trigger bulk apply and show success feedback', () => {
    cy.mount(<GlobalMissingValues />);
    cy.get('[data-cy="global-missing-value-suggested-N/A"]').click();

    cy.get('[data-cy="global-missing-value-apply-N/A"]').click();

    cy.contains('Applied matching values to all columns!').should('be.visible');
  });

  it('should trigger bulk strip and show info feedback', () => {
    cy.mount(<GlobalMissingValues />);
    cy.get('[data-cy="global-missing-value-suggested-N/A"]').click();

    cy.get('[data-cy="global-missing-value-strip-N/A"]').click();

    cy.contains('Stripped value from all columns!').should('be.visible');
  });
});
