describe('Persistence', () => {
  it('persists the name', () => {
    const name = 'TEST NAME'
    cy.visit('http://localhost:8080')
    cy.get('input[type=text]').clear().type(name)
    cy.reload(true)
    cy.get('input[type=text]').should('have.value', name)
  })
})
