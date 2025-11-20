import { DataType } from '../../datamodel';
import ValueAnnotationTabs, {
  type ValueAnnotationTabColumn,
} from '../../src/components/ValueAnnotationTabs';

const columnOrder = ['1', '2'];

const columns: Record<string, ValueAnnotationTabColumn> = {
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
  columns,
  columnOrder,
  onUpdateDescription: () => {},
  onUpdateUnits: () => {},
  onToggleMissingValue: () => {},
  onUpdateFormat: () => {},
  onUpdateLevelTerm: () => {},
};

describe('ValueAnnotationTabs', () => {
  it('should render the component correctly', () => {
    cy.mount(
      <ValueAnnotationTabs
        columns={props.columns}
        columnOrder={props.columnOrder}
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
      <ValueAnnotationTabs
        columns={props.columns}
        columnOrder={props.columnOrder}
        onUpdateDescription={spy}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
        onUpdateLevelTerm={props.onUpdateLevelTerm}
      />
    );
    cy.get('[data-cy="2-tab"]').click();
    cy.get('[data-cy="2-M-description"]').should('be.visible');
    cy.get('[data-cy="2-M-description"] textarea').first().clear();
    cy.get('[data-cy="2-M-description"]').type('updated');
    cy.get('@updateDescription').should('have.been.calledWith', '2', 'M', 'updated');
  });

  it('should fire onUpdateUnits when editing units', () => {
    const spy = cy.spy().as('updateUnits');
    cy.mount(
      <ValueAnnotationTabs
        columns={props.columns}
        columnOrder={props.columnOrder}
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
      <ValueAnnotationTabs
        columns={props.columns}
        columnOrder={props.columnOrder}
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
      <ValueAnnotationTabs
        columns={props.columns}
        columnOrder={props.columnOrder}
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
    const columnsWithoutTerm = {
      ...props.columns,
      '2': {
        ...props.columns['2'],
        levels: {
          M: { description: 'Male', standardizedTerm: 'term:male' },
          F: { description: 'Female', standardizedTerm: undefined },
        },
      },
    };
    cy.mount(
      <ValueAnnotationTabs
        columns={columnsWithoutTerm}
        columnOrder={props.columnOrder}
        onUpdateDescription={props.onUpdateDescription}
        onUpdateUnits={props.onUpdateUnits}
        onToggleMissingValue={props.onToggleMissingValue}
        onUpdateFormat={props.onUpdateFormat}
        onUpdateLevelTerm={spy}
      />
    );
    cy.get('[data-cy="2-tab"]').click();
    cy.get('[data-cy="2-F-term-dropdown"]').type('Female{downArrow}{Enter}');
    cy.get('@updateLevelTerm').should('have.been.calledWith', '2', 'F', 'term:female');
  });
});
