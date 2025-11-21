import { DataType } from '../../datamodel';
import ColumnTypeCollapse from '../../src/components/ColumnTypeCollapse';
import type { ColumnGroupColumn } from '../../src/hooks/useValueAnnotationColumns';

const baseColumns: ColumnGroupColumn[] = [
  {
    id: '1',
    column: {
      id: '1',
      name: 'participant_id',
      allValues: [],
      dataType: DataType.continuous,
    },
  },
  {
    id: '2',
    column: {
      id: '2',
      name: 'age',
      allValues: [],
      dataType: DataType.continuous,
    },
  },
];

const groupedColumns: ColumnGroupColumn[] = [
  {
    id: '3',
    column: {
      id: '3',
      name: 'assessment_score',
      allValues: [],
      dataType: DataType.categorical,
      isPartOf: 'term:subscaleA',
    },
  },
  {
    id: '4',
    column: {
      id: '4',
      name: 'assessment_error',
      allValues: [],
      dataType: DataType.categorical,
      isPartOf: 'term:subscaleB',
    },
  },
];

describe('ColumnTypeCollapse', () => {
  it('renders non-multi-column groups and toggles visibility', () => {
    cy.mount(
      <ColumnTypeCollapse
        label="continuous"
        dataType="Continuous"
        columns={baseColumns}
        onSelect={() => {}}
        selectedColumnId="1"
      />
    );

    cy.get('[data-cy="side-column-nav-bar-continuous"]').should('contain', 'participant_id');
    cy.get('[data-cy="side-column-nav-bar-continuous-toggle-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-continuous-participant_id"]').should('not.be.visible');
  });

  it('renders multi-column grouped variables', () => {
    cy.mount(
      <ColumnTypeCollapse
        label="assessment tool"
        columns={groupedColumns}
        onSelect={() => {}}
        selectedColumnId="3"
        isMultiColumnMeasure
        groupedColumns={[
          {
            label: 'Subscale A',
            columns: [groupedColumns[0]],
          },
          {
            label: 'Subscale B',
            columns: [groupedColumns[1]],
          },
        ]}
      />
    );

    cy.get('[data-cy="side-column-nav-bar-assessment tool"]').should('contain', 'assessment_score');
    cy.get('[data-cy="side-column-nav-bar-assessment tool-Subscale A-toggle-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-assessment tool-Subscale A-assessment_score"]').should(
      'not.be.visible'
    );
  });

  it('fires onSelect when header is clicked', () => {
    const spy = cy.spy().as('onSelect');
    cy.mount(
      <ColumnTypeCollapse
        label="continuous"
        dataType="Continuous"
        columns={baseColumns}
        onSelect={spy}
        selectedColumnId="1"
      />
    );

    cy.get('[data-cy="side-column-nav-bar-continuous-select-button"]').click();
    cy.get('@onSelect').should('have.been.calledWith', {
      columnIDs: ['1', '2'],
      dataType: 'Continuous',
    });
  });
});
