import { h } from 'preact'
import { cleanup, render, fireEvent } from 'preact-testing-library'
import { Header } from './Header'

describe('Header', () => {
  afterEach(cleanup)

  const noop = () => { /* noop */ }
  
  it('renders title', () => {
    const { getByText } = render(<Header name='' onNameChange={noop} onSignatureChange={noop} />)
    expect(getByText('Irregular Apocalypse')).toBeTruthy()
  })

  it('sets the default name', () => {
    const name = 'Test Name'
    const { getByPlaceholderText } = render(<Header name={name} onNameChange={noop} onSignatureChange={noop} />)
    const field = getByPlaceholderText(/your name/i) as HTMLInputElement
    expect(field.value).toBe(name)
  })

  it('handles name field changes', () => {
    const fn = jest.fn()
    const { getByPlaceholderText } = render(<Header name='' onNameChange={fn} onSignatureChange={noop} />)
    const field = getByPlaceholderText(/your name/i) as HTMLInputElement
    const name = 'Test Name'
    field.value = name
    fireEvent.input(field)
    expect(fn).toHaveBeenCalledWith(name)
  })

  xit('handles signature field changes', () => {
    // FIXME: How to test file inputs?
    const fn = jest.fn()
    const { getByLabelText } = render(<Header name='' onNameChange={noop} onSignatureChange={fn} />)
    const field = getByLabelText(/signature/i) as HTMLInputElement
    const value = new File([], 'signature.png')
    fireEvent.change(field, { target: { value } })
    expect(fn).toHaveBeenCalled()
  })
})
