import DataDictionaryPreview from '../../src/components/DataDictionaryPreview';
import { mockDataDictionaryWithAnnotations } from '../../src/utils/mocks';

describe('CustomDataDictionaryPreview', () => {
  beforeEach(() => {
    cy.mount(<DataDictionaryPreview dataDictionary={mockDataDictionaryWithAnnotations} />);
  });

  it('should render the component correctly', () => {
    cy.get('[data-cy="data-dictionary-preview"]').should('be.visible');
    cy.get('[data-cy="data-dictionary-preview"]').should('contain', 'participant_id');
    cy.get('[data-cy="data-dictionary-preview"]').should('contain', 'nb:ParticipantID');
    cy.get('[data-cy="data-dictionary-preview"]').should('contain', 'age');
    cy.get('[data-cy="data-dictionary-preview"]').should('contain', 'Age');
    cy.get('[data-cy="data-dictionary-preview"]').should('contain', 'sex');
    cy.get('[data-cy="data-dictionary-preview"]').should('contain', 'nb:Sex');
  });
});
