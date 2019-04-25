import { h } from 'preact'
import { route } from 'preact-router'
import { cleanup, fireEvent, debounceRenderingOff, render } from 'preact-testing-library'
import { format } from 'date-fns'
import { App } from './App'

describe('App', () => {
  beforeEach(cleanup)

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

  it('includes the name in the title', () => {
    debounceRenderingOff()
    render(<App />)
    route('/2018/05')
    expect(document.title).toContain('May 2018')
  })

  it('includes the name in the title', () => {
    debounceRenderingOff()
    const { getByPlaceholderText } = render(<App />)
    const field = getByPlaceholderText(/your name/i) as HTMLInputElement
    const name = 'Test Name'
    field.value = name
    fireEvent.input(field)
    expect(document.title).toContain(name)
  })

  it('clears signature when period is unchecked', () => {
    debounceRenderingOff()
    const { getByLabelText } = render(<App />)
    const checkbox = getByLabelText(/mon/i) as HTMLInputElement
    fireEvent.click(checkbox)
    const img = checkbox.parentElement!.querySelector('img')
    expect(img).toBeNull()
  })

  it('adds signature when period is checked', () => {
    debounceRenderingOff()
    const { getByLabelText } = render(<App />)
    const checkbox = getByLabelText(/sun/i) as HTMLInputElement
    fireEvent.click(checkbox)
    const img = checkbox.parentElement!.querySelector('img')
    expect(img).not.toBeNull()
  })
})
