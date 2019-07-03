// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

interface AddFileOptions {
  blob: Blob
  filename: string
}

Cypress.Commands.add(
  'addFile',
  { prevSubject: 'element' },
  (subject: JQuery<HTMLInputElement>, options: AddFileOptions) => {
    const file = new File([options.blob], options.filename)
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    subject[0].files = dataTransfer.files
    return subject
  }
)
