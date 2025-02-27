describe('Simlpe e2e test', () => {
  it('Steps through different app views', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Welcome');
    cy.get('[data-cy="get started-button"]').click();
    cy.contains('Upload');
    cy.get('[data-cy="next - column annotation-button"]').click();
    cy.contains('Column Annotation');
    cy.get('[data-cy="next - value annotation-button"]').click();
    cy.contains('Value Annotation');
    cy.get('[data-cy="next - download-button"]').click();
    cy.contains('Download');
  });
});
