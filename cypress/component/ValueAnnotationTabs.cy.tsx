import { useState } from 'react';
import ValueAnnotationTabs, {
  type ValueAnnotationTabMetadata,
} from '../../src/components/ValueAnnotationTabs';
import type { ActiveValueAnnotationColumn } from '../../src/hooks/useValueAnnotationColumn';
import { DataType } from '../../src/utils/internal_types';

const columnOrder = ['1', '2'];

const columnsMeta: Record<string, ValueAnnotationTabMetadata> = {
  '1': { id: '1', name: 'age', dataType: DataType.continuous, isMultiColumnMeasure: false },
  '2': { id: '2', name: 'sex', dataType: DataType.categorical, isMultiColumnMeasure: false },
};

const columnData: Record<string, ActiveValueAnnotationColumn> = {
  '1': {
    id: '1',
    name: 'age',
    dataType: DataType.continuous,
    uniqueValues: ['25', '30', '35'],
    levels: {},
    missingValues: [],
    units: '',
    formatId: 'nb:FromFloat',
    termOptions: [],
    formatOptions: [
      { id: 'nb:FromFloat', label: 'float', examples: ['31.5'] },
      { id: 'nb:FromEuro', label: 'euro', examples: ['31,5'] },
    ],
    showStandardizedTerm: false,
    showMissingToggle: true,
    showFormat: true,
    showUnits: true,
  },
  '2': {
    id: '2',
    name: 'sex',
    dataType: DataType.categorical,
    uniqueValues: ['M', 'F', 'N/A'],
    levels: {
      M: { description: 'Male', standardizedTerm: 'term:male' },
      F: { description: 'Female', standardizedTerm: 'term:female' },
    },
    missingValues: ['N/A'],
    units: '',
    formatId: null,
    termOptions: [
      { id: 'term:male', label: 'Male' },
      { id: 'term:female', label: 'Female' },
    ],
    formatOptions: [],
    showStandardizedTerm: true,
    showMissingToggle: true,
    showFormat: false,
    showUnits: true,
  },
};

const props = {
  columnOrder,
  columnsMeta,
  columnData,
  onUpdateDescription: () => {},
  onUpdateUnits: () => {},
  onToggleMissingValue: () => {},
  onUpdateFormat: () => {},
  onUpdateLevelTerm: () => {},
};

type TestHarnessProps = {
  initialActiveColumnId?: string;
  columnOrder: string[];
  columnsMeta: typeof columnsMeta;
  columnData: typeof columnData;
  onUpdateDescription: (columnID: string, value: string, description: string) => void;
  onUpdateUnits: (columnID: string, units: string) => void;
  onToggleMissingValue: (columnID: string, value: string, isMissing: boolean) => void;
  onUpdateFormat: (columnID: string, formatId: string | null) => void;
  onUpdateLevelTerm: (columnID: string, value: string, termId: string | null) => void;
};

function TestHarness({
  initialActiveColumnId,
  columnOrder: order,
  columnsMeta: meta,
  columnData: data,
  onUpdateDescription,
  onUpdateUnits,
  onToggleMissingValue,
  onUpdateFormat,
  onUpdateLevelTerm,
}: TestHarnessProps) {
  const initialId = initialActiveColumnId ?? order[0] ?? '1';
  const [activeColumnId, setActiveColumnId] = useState(initialId);

  return (
    <ValueAnnotationTabs
      columnOrder={order}
      columnsMeta={meta}
      activeColumnId={activeColumnId}
      activeColumn={data[activeColumnId]}
      onChangeActiveColumn={setActiveColumnId}
      onUpdateDescription={onUpdateDescription}
      onUpdateUnits={onUpdateUnits}
      onToggleMissingValue={onToggleMissingValue}
      onUpdateFormat={onUpdateFormat}
      onUpdateLevelTerm={onUpdateLevelTerm}
    />
  );
}

TestHarness.defaultProps = {
  initialActiveColumnId: '1',
};

describe('ValueAnnotationTabs', () => {
  it('should render the component correctly', () => {
    cy.mount(
      <TestHarness
        columnOrder={props.columnOrder}
        columnsMeta={props.columnsMeta}
        columnData={props.columnData}
        onUpdateDescription={props.onUpdateDescription}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="value-annotation-tabs"]').should('be.visible');
    cy.get('[data-cy="1-tab"]').should('be.visible').and('contain', 'age');
    cy.get('[data-cy="2-tab"]').should('be.visible').and('contain', 'sex');
  });

  it('should fire onUpdateDescription when editing a level description', () => {
    const spy = cy.spy().as('updateDescription');
    cy.mount(
      <TestHarness
        initialActiveColumnId="2"
        columnOrder={props.columnOrder}
        columnsMeta={props.columnsMeta}
        columnData={props.columnData}
        onUpdateDescription={spy}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="2-M-description"]').should('be.visible');
    cy.get('[data-cy="2-M-description"] textarea').first().clear();
    cy.get('[data-cy="2-M-description"]').type('updated');
    cy.get('@updateDescription').should('have.been.calledWith', '2', 'M', 'updated');
  });

  it('should fire onUpdateUnits when editing units', () => {
    const spy = cy.spy().as('updateUnits');
    cy.mount(
      <TestHarness
        columnOrder={props.columnOrder}
        columnsMeta={props.columnsMeta}
        columnData={props.columnData}
        onUpdateDescription={props.onUpdateDescription}
        onUpdateUnits={spy}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="1-tab"]').click();
    cy.get('[data-cy="1-description"]').should('be.visible');
    cy.get('[data-cy="1-description"] textarea').first().clear();
    cy.get('[data-cy="1-description"]').type('years');
    cy.get('@updateUnits').should('have.been.calledWith', '1', 'years');
  });

  it('should fire onToggleMissingValue when toggling missing values', () => {
    const spy = cy.spy().as('toggleMissing');
    cy.mount(
      <TestHarness
        columnOrder={props.columnOrder}
        columnsMeta={props.columnsMeta}
        columnData={props.columnData}
        onUpdateDescription={props.onUpdateDescription}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={spy}
        onUpdateFormat={props.onUpdateFormat}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="1-tab"]').click();
    cy.get('[data-cy="1-35-missing-value-yes"]').click();
    cy.get('@toggleMissing').should('have.been.calledWith', '1', '35', true);
  });

  it('should fire onUpdateFormat when selecting a format', () => {
    const spy = cy.spy().as('updateFormat');
    cy.mount(
      <TestHarness
        columnOrder={props.columnOrder}
        columnsMeta={props.columnsMeta}
        columnData={props.columnData}
        onUpdateDescription={props.onUpdateDescription}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={spy}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="1-tab"]').click();
    cy.get('[data-cy="1-format-dropdown"]').type('euro{downArrow}{Enter}');
    cy.get('@updateFormat').should('have.been.calledWith', '1', 'nb:FromEuro');
  });

  it('should fire onUpdateLevelTerm when selecting a standardized term', () => {
    const spy = cy.spy().as('updateLevelTerm');
    const dataWithoutTerm = {
      ...props.columnData,
      '2': {
        ...props.columnData['2'],
        levels: {
          M: { description: 'Male', standardizedTerm: 'term:male' },
          F: { description: 'Female', standardizedTerm: undefined },
        },
      },
    };
    cy.mount(
      <TestHarness
        initialActiveColumnId="2"
        columnOrder={props.columnOrder}
        columnsMeta={props.columnsMeta}
        columnData={dataWithoutTerm}
        onUpdateDescription={props.onUpdateDescription}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
        onUpdateLevelTerm={spy}
      />
    );
    cy.get('[data-cy="2-F-term-dropdown"]').type('Female{downArrow}{Enter}');
    cy.get('@updateLevelTerm').should('have.been.calledWith', '2', 'F', 'term:female');
  });
});
