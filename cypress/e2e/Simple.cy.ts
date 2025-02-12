describe('Simlpe e2e test', () => {
  it('Steps through differnt app views', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Welcome');
    cy.contains('Start - Upload').click();
    cy.contains('Upload');
    cy.contains('Next - Column Annotation').click();
    cy.contains('Column Annotation');
    cy.contains('Next - Value Annotation').click();
    cy.contains('Value Annotation');
    // reload to make sure the currentView persists
    cy.reload();
    cy.contains('Value Annotation');
    cy.contains('Next - Download').click();
    cy.contains('Download');
  });
});
