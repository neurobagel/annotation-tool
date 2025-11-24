import { DataType } from '../../internal_types';
import SideColumnNavBar from '../../src/components/SideColumnNavBar';
import type { UnannotatedColumnGroup } from '../../src/hooks/useValueAnnotationColumns';
import type { ValueAnnotationNavAnnotatedGroup } from '../../src/hooks/useValueAnnotationNavData';

const annotatedGroups: ValueAnnotationNavAnnotatedGroup[] = [
  {
    standardizedVariableId: 'nb:Diagnosis',
    label: 'diagnosis',
    columns: [
      {
        id: '1',
        column: {
          id: '1',
          name: 'group_dx',
          allValues: [],
          dataType: DataType.categorical,
        },
      },
    ],
    isMultiColumnMeasure: false,
    groupedColumns: [],
  },
  {
    standardizedVariableId: 'nb:Assessment',
    label: 'assessment tool',
    columns: [
      {
        id: '2',
        column: {
          id: '2',
          name: 'assessment_score',
          allValues: [],
          dataType: DataType.categorical,
          isPartOf: 'term:subscaleA',
        },
      },
      {
        id: '3',
        column: {
          id: '3',
          name: 'assessment_error',
          allValues: [],
          dataType: DataType.categorical,
          isPartOf: 'term:subscaleB',
        },
      },
    ],
    isMultiColumnMeasure: true,
    groupedColumns: [
      {
        label: 'Previous IQ assessment by pronunciation',
        columns: [
          {
            id: '2',
            column: {
              id: '2',
              name: 'assessment_score',
              allValues: [],
              dataType: DataType.categorical,
            },
          },
        ],
      },
      {
        label: 'Ungrouped',
        columns: [
          {
            id: '3',
            column: {
              id: '3',
              name: 'assessment_error',
              allValues: [],
              dataType: DataType.categorical,
            },
          },
        ],
      },
    ],
  },
];

const unannotatedGroups: UnannotatedColumnGroup[] = [
  {
    key: DataType.categorical,
    columns: [
      {
        id: '4',
        column: {
          id: '4',
          name: 'sex',
          allValues: [],
          dataType: DataType.categorical,
        },
      },
    ],
  },
  {
    key: DataType.continuous,
    columns: [
      {
        id: '5',
        column: {
          id: '5',
          name: 'some_continuous_column',
          allValues: [],
          dataType: DataType.continuous,
        },
      },
    ],
  },
  {
    key: 'other',
    columns: [
      {
        id: '6',
        column: {
          id: '6',
          name: 'age',
          allValues: [],
        },
      },
    ],
  },
];

describe('SideColumnNavBar', () => {
  it('should render annotated and unannotated groups', () => {
    cy.mount(
      <SideColumnNavBar
        annotatedGroups={annotatedGroups}
        unannotatedGroups={unannotatedGroups}
        onSelect={() => {}}
        selectedColumnId="5"
      />
    );

    cy.get('[data-cy="side-column-nav-bar-diagnosis"]').should('contain', 'group_dx');
    cy.get('[data-cy="side-column-nav-bar-assessment tool"]').should('contain', 'assessment_score');
    cy.get('[data-cy="side-column-nav-bar-unannotated"]').click();
    cy.get('[data-cy="side-column-nav-bar-categorical"]').should('contain', 'sex');
    cy.get('[data-cy="side-column-nav-bar-continuous"]').should(
      'contain',
      'some_continuous_column'
    );
    cy.get('[data-cy="side-column-nav-bar-other"]').should('contain', 'age');
  });

  it('should fire onSelect when a group is chosen', () => {
    const spy = cy.spy().as('onSelect');
    cy.mount(
      <SideColumnNavBar
        annotatedGroups={annotatedGroups}
        unannotatedGroups={unannotatedGroups}
        onSelect={spy}
        selectedColumnId="1"
      />
    );
    cy.get('[data-cy="side-column-nav-bar-unannotated"]').click();
    cy.get('[data-cy="side-column-nav-bar-categorical-select-button"]').click();
    cy.get('@onSelect').should('have.been.calledWith', {
      columnIDs: ['4'],
      dataType: 'Categorical',
    });
  });
});
