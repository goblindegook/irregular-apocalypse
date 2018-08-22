import { h } from 'preact'
import { cleanup, render, fireEvent } from 'preact-testing-library'
import { Header } from './Header'

describe('Header', () => {
  afterEach(cleanup)

  const noop = () => { /* noop */ }
  
  it('renders month name and year in the title', () => {
    const { getByText } = render(<Header name='' month={12} year={2012} onNameChange={noop} onSignatureChange={noop} />)
    expect(getByText('December 2012')).toBeTruthy()
  })

  it('sets the default name', () => {
    const name = 'Test Name'
    const { getByPlaceholderText } = render(<Header name={name} month={12} year={2012} onNameChange={noop} onSignatureChange={noop} />)
    const field = getByPlaceholderText(/your name/i) as HTMLInputElement
    expect(field.value).toBe(name)
  })

  it('handles name field changes', () => {
    const fn = jest.fn()
    const { getByPlaceholderText } = render(<Header name='' month={12} year={2012} onNameChange={fn} onSignatureChange={noop} />)
    const field = getByPlaceholderText(/your name/i) as HTMLInputElement
    const name = 'Test Name'
    field.value = name
    fireEvent.input(field)
    expect(fn).toHaveBeenCalledWith(name)
  })

  xit('handles signature field changes', () => {
    // FIXME: How to test file inputs?
    const fn = jest.fn()
    const { getByLabelText } = render(<Header name='' month={12} year={2012} onNameChange={noop} onSignatureChange={fn} />)
    const field = getByLabelText(/signature/i) as HTMLInputElement
    const value = new File([], 'signature.png')
    fireEvent.change(field, { target: { value } })
    expect(fn).toHaveBeenCalled()
  })
})
