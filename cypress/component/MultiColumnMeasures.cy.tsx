import MultiColumnMeasures from '../../src/components/MultiColumnMeasures';
import useDataStore from '../../src/stores/data';
import { mockConfig } from '../../src/utils/mocks';

describe('MultiColumnMeasures', () => {
  beforeEach(() => {
    const updateColumnIsPartOfSpy = cy.spy().as('updateColumnIsPartOfSpy');
    const updateColumnStandardizedVariable = cy.spy().as('updateColumnStandardizedVariable');

    useDataStore.setState({
      updateColumnIsPartOf: updateColumnIsPartOfSpy,
      updateColumnStandardizedVariable,
      config: mockConfig,
      termOptions: {
        'nb:Assessment': [
          {
            identifier: 'someIdentifier',
            label: 'some term',
          },
          {
            identifier: 'anotherIdentifier',
            label: 'another term',
          },
          {
            identifier: 'someOtherIdentifier',
            label: 'some other term',
          },
        ],
      },
      columns: {
        '1': {
          header: 'some column',
          standardizedVariable: {
            identifier: 'nb:Assessment',
            label: 'Assessment Tool',
          },
          isPartOf: {
            termURL: 'someIdentifier',
            label: 'some term',
          },
        },
        '2': {
          header: 'another column',
          standardizedVariable: {
            identifier: 'nb:Assessment',
            label: 'Assessment Tool',
          },
        },
        '3': {
          header: 'some other column',
          standardizedVariable: {
            identifier: 'nb:Assessment',
            label: 'Assessment Tool',
          },
        },
      },
      mappedMultiColumnMeasureStandardizedVariables: [
        {
          identifier: 'nb:Assessment',
          label: 'Assessment Tool',
        },
      ],
      multiColumnMeasuresStates: {
        'nb:Assessment': {
          terms: [
            {
              identifier: 'someIdentifier',
              label: 'some term',
            },
            {
              identifier: 'anotherIdentifier',
              label: 'another term',
            },
            {
              identifier: 'someOtherIdentifier',
              label: 'some other term',
            },
          ],
          termCards: [
            {
              id: 'card-0',
              term: {
                identifier: 'someIdentifier',
                label: 'some term',
              },
              mappedColumns: ['1'],
            },
          ],
        },
      },
      columnOptionsForVariables: {
        'nb:Assessment': [
          { id: '1', label: 'some column', disabled: true },
          { id: '2', label: 'another column', disabled: false },
          { id: '3', label: 'some other column', disabled: false },
        ],
      },
      availableTermsForVariables: {
        'nb:Assessment': {
          'card-0': [
            { identifier: 'someIdentifier', label: 'some term', disabled: true },
            { identifier: 'anotherIdentifier', label: 'another term', disabled: false },
            { identifier: 'someOtherIdentifier', label: 'some other term', disabled: false },
          ],
          null: [
            { identifier: 'someIdentifier', label: 'some term', disabled: true },
            { identifier: 'anotherIdentifier', label: 'another term', disabled: false },
            { identifier: 'someOtherIdentifier', label: 'some other term', disabled: false },
          ],
        },
      },
    });

    cy.mount(<MultiColumnMeasures />);
  });

  it('renders the component correctly', () => {
    cy.get('[data-cy="multi-column-measures-card-0"]').should('be.visible');
    cy.get('[data-cy="remove-card-0-button"]').should('be.visible');
    cy.get('[data-cy="multi-column-measures-card-0-header"]').should('contain', 'some term');
    cy.get('[data-cy="mapped-column-1"]').should('be.visible').and('contain', 'some column');
    cy.get('[data-cy="multi-column-measures-columns-card"]')
      .should('be.visible')
      .and('contain', 'some column')
      .and('contain', 'another column')
      .and('contain', 'some other column')
      .and('contain', '1 column assigned');
  });

  it('fires updateColumnIsPartOf with the appropriate payload when a column is mapped to a term', () => {
    cy.get('[data-cy="add-term-card-button"]').click();
    cy.get('[data-cy="multi-column-measures-card-1-title-dropdown"]').should('be.visible');
    cy.get('[data-cy="multi-column-measures-card-1-title-dropdown"]').type(
      'another term{downArrow}{enter}'
    );
    cy.get('[data-cy="multi-column-measures-card-1-columns-dropdown"]').type(
      'another column{downArrow}{enter}'
    );
    cy.get('[data-cy="mapped-column-2"]').should('be.visible').and('contain', 'another column');
    cy.get('@updateColumnIsPartOfSpy').should('have.been.calledWith', '2', {
      identifier: 'anotherIdentifier',
      label: 'another term',
    });
  });

  it('fires updateColumnIsPartOf with the appropriate payload when a column is removed from a term card', () => {
    cy.get('[data-cy="mapped-column-1"]').should('be.visible').and('contain', 'some column');
    cy.get('[data-cy="mapped-column-1"] svg').click();
    cy.get('@updateColumnIsPartOfSpy').should('have.been.calledWith', '1', null);
    cy.get('[data-cy="mapped-column-1"]').should('not.exist');
  });

  it('fires updateColumnIsPartOf with the appropriate payload when a term card containing columns is removed', () => {
    cy.get('[data-cy="remove-card-0-button"]').click();
    cy.get('@updateColumnIsPartOfSpy').should('have.been.calledWith', '1', null);
    cy.get('[data-cy="mapped-column-1"]').should('not.exist');
  });
  it('fires updateColumnStandardizedVariable with the appropriate payload when a column is removed from the multi-column instrument', () => {
    cy.get('[data-cy="unassign-column-1"]').click();
    cy.get('@updateColumnStandardizedVariable').should('have.been.calledWith', '1', null);
    cy.get('[data-cy="mapped-column-1"]').should('not.exist');
  });
});
