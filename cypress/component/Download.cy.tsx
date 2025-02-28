import Ajv from 'ajv';
import Download from '../../src/components/Download';
import useDataStore from '../../src/stores/data';
import {
  columnsWithDescription,
  columnsWithNoDescription,
  mockDataDictionaryWithDescription,
  mockDataDictionaryWithNoDescription,
} from '../../src/utils/mocks';

interface ValidateFunction {
  (data: unknown): boolean;
  errors?: { instancePath: string }[];
}

describe('Download', () => {
  it('renders the component correctly', () => {
    cy.mount(<Download />);

    cy.get('[data-cy="download"]').should('be.visible');
    cy.get('[data-cy="complete-annotations-alert"] img')
      .should('be.visible')
      .and('have.attr', 'alt', 'bagel confetti');
    cy.get('[data-cy="complete-annotations-alert"]')
      .should('be.visible')
      .and('contain', 'You have successfully created');
    cy.get('[data-cy="data-dictionary-toggle-preview-button"]').should('be.visible');
    cy.get('[data-cy="data-dictionary-preview"]').should('be.visible');
    cy.get('[data-cy="data-dictionary-toggle-preview-button"]').click();
    cy.get('[data-cy="data-dictionary-preview"]').should('not.be.visible');
    cy.get('[data-cy="data-dictionary-next-steps-list"]')
      .should('be.visible')
      .and('contain', '.json data dictionary');
    cy.get('[data-cy="download-data-dictionary-button"]').should('be.visible');
  });

  it('renders the component correctly when the data dictionary is invalid', () => {
    const validateStub = cy.stub().returns(false) as ValidateFunction;
    validateStub.errors = [{ instancePath: '/column1' }, { instancePath: '/column2' }];

    cy.stub(Ajv.prototype, 'compile').callsFake(() => validateStub);

    cy.mount(<Download />);

    cy.get('[data-cy="download"]').should('be.visible');
    cy.get('[data-cy="incomplete-annotations-alert"]')
      .should('be.visible')
      .and('contain', 'incomplete annotations');
    cy.get('[data-cy="incomplete-annotations-list"]')
      .should('be.visible')
      .and('contain', 'column1');
    cy.get('[data-cy="data-dictionary-preview"]').should('be.visible');
    cy.get('[data-cy="download-data-dictionary-button"]').should('be.disabled');
    cy.get('[data-cy="force-download-switch"]').should('be.visible');
    cy.get('[data-cy="force-download-switch"]').click();
    cy.get('[data-cy="download-data-dictionary-button"]').should('be.enabled');
  });

  it('generates the data dictionary file with descriptions when the download button is clicked', () => {
    useDataStore.setState({ columns: columnsWithDescription });
    useDataStore.setState({ uploadedDataTableFileName: 'someFileName' });

    cy.mount(<Download />);

    cy.get('[data-cy="download-data-dictionary-button"]').click();
    cy.readFile('cypress/downloads/someFileName_annotated.json').then((fileContent) => {
      expect(fileContent).to.deep.equal(mockDataDictionaryWithDescription);
    });
  });

  it('generates the data dictionary file with no descriptions when the download button is clicked', () => {
    useDataStore.setState({ columns: columnsWithNoDescription });
    useDataStore.setState({ uploadedDataTableFileName: 'someFileName' });

    cy.mount(<Download />);

    cy.get('[data-cy="download-data-dictionary-button"]').click();
    cy.readFile('cypress/downloads/someFileName_annotated.json').then((fileContent) => {
      expect(fileContent).to.deep.equal(mockDataDictionaryWithNoDescription);
    });
  });
});
