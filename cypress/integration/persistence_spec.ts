describe('Application storage', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    indexedDB.deleteDatabase('irregular-apocalypse')
  })

  it('persists user input', () => {
    const name = 'TEST NAME'
    cy.visit('/2018/08')

    cy.get('input[type=text]')
      .first()
      .clear()
      .type(name)

    cy.get('input[type=checkbox]')
      .first()
      .uncheck()

    cy.reload(true)

    cy.get('input[type=text]')
      .first()
      .should('have.value', name)

    cy.get('input[type=checkbox]')
      .first()
      .should('not.be.checked')
  })

  it('persists image uploads', () => {
    const SIGNATURE = 'fixture.jpg'

    cy.visit('http://localhost:8080/2018/08')

    return cy
      .fixture<BinaryType>(SIGNATURE, 'binary')
      .then(fixture => Cypress.Blob.binaryStringToBlob(fixture, 'image/jpeg'))
      .then(blob =>
        cy
          .get<HTMLInputElement>('input[type=file]')
          .first()
          .then(element => {
            const file = new File([blob], SIGNATURE)
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(file)
            element[0].files = dataTransfer.files
            return element
          })
          .trigger('change', { force: true })
          .then(() => Cypress.Blob.blobToBase64String(blob))
          .then(base64 =>
            cy
              .get('img')
              .first()
              .should('have.attr', 'src')
              .and('contain', base64)
          )
          .then(() => cy.reload(true))
          .then(() => Cypress.Blob.blobToBase64String(blob))
          .then(base64 =>
            cy
              .get('img')
              .first()
              .should('have.attr', 'src')
              .and('contain', base64)
          )
      )
  })
})
