import ColumnTypeCollapse from '../../src/components/ColumnTypeCollapse';
import type { ColumnGroupColumn } from '../../src/hooks/useValueAnnotationColumns';
import { DataType } from '../../src/utils/internal_types';

const baseColumns: ColumnGroupColumn[] = [
  {
    id: '1',
    column: {
      id: '1',
      name: 'weight',
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
  it('should render non-collection groups and toggles visibility', () => {
    cy.mount(
      <ColumnTypeCollapse
        label="continuous"
        dataType="Continuous"
        columns={baseColumns}
        onSelect={() => {}}
        selectedColumnId="1"
        schemaErrors={[]}
      />
    );

    cy.get('[data-cy="side-column-nav-bar-continuous"]').should('contain', 'weight');
    cy.get('[data-cy="side-column-nav-bar-continuous-toggle-button"]').click();
    cy.get('[data-cy="side-column-nav-bar-continuous-weight"]').should('not.be.visible');
  });

  it('should render collection groups', () => {
    cy.mount(
      <ColumnTypeCollapse
        label="assessment tool"
        columns={groupedColumns}
        onSelect={() => {}}
        selectedColumnId="3"
        isCollection
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
        schemaErrors={[]}
      />
    );

    cy.get('[data-cy="side-column-nav-bar-assessment tool"]').should('contain', 'assessment_score');

    cy.get('[data-cy="side-column-nav-bar-assessment tool-Subscale A-assessment_score"]').should(
      'not.be.visible'
    );

    cy.get('[data-cy="side-column-nav-bar-assessment tool-Subscale A-toggle-button"]').click();

    cy.get('[data-cy="side-column-nav-bar-assessment tool-Subscale A-assessment_score"]').should(
      'be.visible'
    );
  });

  it('should fire onSelect when header is clicked', () => {
    const spy = cy.spy().as('onSelect');
    cy.mount(
      <ColumnTypeCollapse
        label="continuous"
        dataType="Continuous"
        columns={baseColumns}
        onSelect={spy}
        selectedColumnId="1"
        schemaErrors={[]}
      />
    );

    cy.get('[data-cy="side-column-nav-bar-continuous-select-button"]').click();
    cy.get('@onSelect').should('have.been.calledWith', {
      columnIDs: ['1', '2'],
      dataType: 'Continuous',
    });
  });

  describe('Completeness Visualization', () => {
    it('should show incomplete icons for completely incomplete categories', () => {
      cy.mount(
        <ColumnTypeCollapse
          label="continuous"
          dataType="Continuous"
          columns={baseColumns}
          onSelect={() => {}}
          selectedColumnId="1"
          schemaErrors={['weight', 'age']}
        />
      );

      cy.get('[data-cy="column-incomplete-icon-1"]').should('be.visible');
      cy.get('[data-cy="column-incomplete-icon-2"]').should('be.visible');
      cy.get('[data-cy="column-complete-icon-1"]').should('not.exist');
      cy.get('[data-cy="column-complete-icon-2"]').should('not.exist');

      cy.get('[data-cy="category-incomplete-icon-continuous"]').should('be.visible');
      cy.get('[data-cy="category-complete-icon-continuous"]').should('not.exist');
    });

    it('should show complete icons for fully complete categories', () => {
      cy.mount(
        <ColumnTypeCollapse
          label="continuous"
          dataType="Continuous"
          columns={baseColumns}
          onSelect={() => {}}
          selectedColumnId="1"
          schemaErrors={[]}
        />
      );

      cy.get('[data-cy="column-complete-icon-1"]').should('be.visible');
      cy.get('[data-cy="column-complete-icon-2"]').should('be.visible');
      cy.get('[data-cy="column-incomplete-icon-1"]').should('not.exist');
      cy.get('[data-cy="column-incomplete-icon-2"]').should('not.exist');

      cy.get('[data-cy="category-complete-icon-continuous"]').should('be.visible');
      cy.get('[data-cy="category-incomplete-icon-continuous"]').should('not.exist');
    });

    it('should show the appropriate icons for complete and partially complete categories', () => {
      cy.mount(
        <ColumnTypeCollapse
          label="continuous"
          dataType="Continuous"
          columns={baseColumns}
          onSelect={() => {}}
          selectedColumnId="1"
          schemaErrors={['weight']}
        />
      );

      cy.get('[data-cy="column-incomplete-icon-1"]').should('be.visible');
      cy.get('[data-cy="column-complete-icon-1"]').should('not.exist');

      cy.get('[data-cy="column-complete-icon-2"]').should('be.visible');
      cy.get('[data-cy="column-incomplete-icon-2"]').should('not.exist');

      cy.get('[data-cy="category-incomplete-icon-continuous"]').should('be.visible');
      cy.get('[data-cy="category-complete-icon-continuous"]').should('not.exist');
    });

    it('should handle nested completeness for collection groups', () => {
      cy.mount(
        <ColumnTypeCollapse
          label="assessment tool"
          columns={groupedColumns}
          onSelect={() => {}}
          selectedColumnId="3"
          isCollection
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
          schemaErrors={['assessment_score']}
        />
      );

      cy.get('[data-cy="category-incomplete-icon-assessment tool"]').should('be.visible');

      cy.get('[data-cy="group-incomplete-icon-Subscale A"]').should('be.visible');
      cy.get('[data-cy="group-complete-icon-Subscale A"]').should('not.exist');

      cy.get('[data-cy="group-complete-icon-Subscale B"]').should('be.visible');
      cy.get('[data-cy="group-incomplete-icon-Subscale B"]').should('not.exist');

      cy.get('[data-cy="side-column-nav-bar-assessment tool-Subscale A-toggle-button"]').click({
        force: true,
      });
      cy.get('[data-cy="column-incomplete-icon-3"]').should('be.visible');

      cy.get('[data-cy="side-column-nav-bar-assessment tool-Subscale B-toggle-button"]').click({
        force: true,
      });
      cy.get('[data-cy="column-complete-icon-4"]').should('be.visible');
    });
  });
});
