describe('Persistence', () => {
  afterEach(() => {
    cy.clearLocalStorage()
  })

  it('persists user input', () => {
    const name = 'TEST NAME'
    cy.visit('http://localhost:8080/2018/08')

    cy.get('input[type=text]').first().clear().type(name)
    cy.get('input[type=checkbox]').first().uncheck()

    cy.reload(true)

    cy.get('input[type=text]').first().should('have.value', name)
    cy.get('input[type=checkbox]').first().should('not.be.checked')
  })
})
