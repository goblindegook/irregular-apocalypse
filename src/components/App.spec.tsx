import { h } from 'preact'
import { route } from 'preact-router'
import { cleanup, fireEvent, debounceRenderingOff, render } from 'preact-testing-library'
import { format } from 'date-fns'
import { App } from './App'

describe('App', () => {
  afterEach(cleanup)

  it('routes default view', () => {
    const date = new Date()
    const { getByText } = render(<App />)
    route('')
    expect(getByText(format(date, 'MMMM YYYY'))).toBeTruthy()
  })

  it('routes month view', () => {
    const { getByText } = render(<App />)
    route('/2018/05')
    expect(getByText('May 2018')).toBeTruthy()
  })

  it('sets the name', () => {
    debounceRenderingOff()
    const { getAllByAltText, getByPlaceholderText } = render(<App />)
    const field = getByPlaceholderText(/your name/i) as HTMLInputElement
    const name = 'Test Name'
    field.value = name
    fireEvent.input(field)
    expect(getAllByAltText(name).length).toBeGreaterThan(1)
  })

  xit('sets the signature', () => {
    // FIXME: How to test file inputs?
    debounceRenderingOff()
    const fn = jest.fn()
    const { container, getByLabelText } = render(<App />)
    const field = getByLabelText(/signature/i) as HTMLInputElement
    const value = new File([], 'signature.png')
    fireEvent.change(field, { target: { value } })
    expect(container.querySelectorAll('img').length).toBeGreaterThan(0)
  })
})
