function addFileBlob(blob: Blob, filename: string) {
  return (element: JQuery<HTMLInputElement>) => {
    const file = new File([blob], filename)
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    element[0].files = dataTransfer.files
    return element
  }
}

function elementAttributeContains(selector: string, attribute: string, contents: string) {
  cy.get(selector).first().should('have.attr', attribute).and('contain', contents)
}

describe('Application storage', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    indexedDB.deleteDatabase('irregular-apocalypse')
  })

  it('persists user input', () => {
    const name = 'TEST NAME'
    cy.visit('/2018/08')

    cy.get('input[type=text]').clear().type(name)

    cy.get('input[type=checkbox]').first().uncheck()

    cy.reload(true)

    cy.get('input[type=text]').should('have.value', name)

    cy.get('input[type=checkbox]').first().should('not.be.checked')
  })

  it('persists image uploads', () => {
    const SIGNATURE = 'fixture.jpg'

    cy.visit('http://localhost:8080/2018/08')

    return cy
      .fixture<BinaryType>(SIGNATURE, 'binary')
      .then((fixture) => Cypress.Blob.binaryStringToBlob(fixture, 'image/jpeg'))
      .then((blob) =>
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy
          .get<HTMLInputElement>('input[type=file]')
          .then(addFileBlob(blob, SIGNATURE))
          .trigger('change', { force: true })
          .then(() => Cypress.Blob.blobToBase64String(blob))
          .then((base64) => elementAttributeContains('img', 'src', base64))
          .wait(50)
          .then(() => cy.reload(true))
          .then(() => Cypress.Blob.blobToBase64String(blob))
          .then((base64) => elementAttributeContains('img', 'src', base64))
      )
  })
})
