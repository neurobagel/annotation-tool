describe('Dummy', () => {
  it('tests', () => {
    cy.visit('http://localhost:5173');
    cy.contains('count').click();
    cy.contains('count').should('contain', '1');
  });
});
