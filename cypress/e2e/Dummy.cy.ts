describe('Dummy', () => {
  it('tests', () => {
    cy.visit('http://localhost:5173');
    cy.contains('Hello World');
  });
});
