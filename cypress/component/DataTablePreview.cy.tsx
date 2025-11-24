import DataTablePreview from '../../src/components/DataTablePreview';
import { mockDataTableFromColumns, mockColumnsAfterDataTableUpload } from '../../src/utils/mocks';

const props = {
  dataTable: mockDataTableFromColumns,
  columns: mockColumnsAfterDataTableUpload,
};

describe('DataTablePreview', () => {
  it('should render the component correctly', () => {
    cy.mount(<DataTablePreview dataTable={props.dataTable} />);
    cy.get('[data-cy="datatable-preview"]').should('be.visible');
  });
  it('verifies the data table preview content', () => {
    cy.mount(<DataTablePreview dataTable={props.dataTable} />);
    cy.get('[data-cy="datatable-preview"] th:nth-child(2)').should('contain', 'age');

    // Check the value of the 3rd column in the 3rd row
    cy.get('[data-cy="datatable-preview"] tr:nth-child(3) td:nth-child(3)').should('contain', 'M');
  });
  it('should navigate to the 3rd page of the table and verify the content', () => {
    cy.mount(<DataTablePreview dataTable={props.dataTable} />);

    // Go the 3rd page of the table
    cy.get('[data-cy="datatable-preview-pagination"]').within(() => {
      cy.get('button[aria-label="Go to next page"]').click();
      cy.get('button[aria-label="Go to next page"]').click();
    });

    cy.get('[data-cy="datatable-preview"] th:nth-child(3)').should('contain', 'sex');

    // Check the value of the 2nd column in the 2nd row
    cy.get('[data-cy="datatable-preview"] tr:nth-child(2) td:nth-child(2)').should('contain', '65');
  });
});
