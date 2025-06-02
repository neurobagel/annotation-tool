import { mockColumns } from '~/utils/mocks';
import ColumnTypeCollapse from '../../src/components/ColumnTypeCollapse';

const props = {
  dataType: 'Continuous' as 'Categorical' | 'Continuous' | null,
  standardizedVariable: {
    identifier: 'nb:ParticipantID',
    label: 'Subject ID',
  },
  columns: mockColumns,
  onSelect: () => {},
  selectedColumnId: '1',
};

describe('ColumnTypeCollapse', () => {
  interface TestCase {
    name: string;
    componentProps: {
      dataType: 'Categorical' | 'Continuous' | null;
      standardizedVariable: { identifier: string; label: string } | null;
    };
    expectedDataCy: string;
    additionalTests?: (dataCy: string) => void;
  }

  const testCases: TestCase[] = [
    {
      name: 'Column with standardized variable',
      componentProps: {
        dataType: props.dataType,
        standardizedVariable: props.standardizedVariable,
      },
      expectedDataCy: 'side-column-nav-bar-subject id',
      additionalTests: (dataCy: string) => {
        it('toggles column visibility when the toggle button is clicked', () => {
          cy.get(`[data-cy="${dataCy}-toggle-button"]`).click();
          cy.get(`[data-cy="${dataCy}-participant_id"]`).should('not.be.visible');
        });
      },
    },
    {
      name: 'Continuous column with no standardized variable',
      componentProps: {
        dataType: props.dataType,
        standardizedVariable: null,
      },
      expectedDataCy: 'side-column-nav-bar-continuous',
    },
    {
      name: 'Categorical column with no standardized variable',
      componentProps: {
        dataType: 'Categorical',
        standardizedVariable: null,
      },
      expectedDataCy: 'side-column-nav-bar-categorical',
    },
  ];

  testCases.forEach(({ name, componentProps, expectedDataCy, additionalTests }) => {
    describe(name, () => {
      beforeEach(() => {
        cy.mount(
          <ColumnTypeCollapse
            dataType={componentProps.dataType}
            standardizedVariable={componentProps.standardizedVariable}
            columns={props.columns}
            onSelect={props.onSelect}
            selectedColumnId={props.selectedColumnId}
          />
        );
      });

      it('renders the component correctly', () => {
        cy.get(`[data-cy="${expectedDataCy}"]`).should('be.visible');
        cy.get(`[data-cy="${expectedDataCy}-toggle-button"]`).should('be.visible');
        cy.get(`[data-cy="${expectedDataCy}-select-button"]`).should('be.visible');
      });

      if (additionalTests) {
        additionalTests(expectedDataCy);
      }
    });
  });
  it('fires onSelect with the appropriate payload when a column is selected', () => {
    const spy = cy.spy().as('onSelect');
    cy.mount(
      <ColumnTypeCollapse
        dataType={props.dataType}
        standardizedVariable={props.standardizedVariable}
        columns={props.columns}
        onSelect={spy}
        selectedColumnId={props.selectedColumnId}
      />
    );
    cy.get('[data-cy="side-column-nav-bar-subject id-select-button"]').click();
    cy.get('@onSelect').should('have.been.calledWith', {
      columnIDs: ['1'],
      dataType: 'Continuous',
    });
  });
});
