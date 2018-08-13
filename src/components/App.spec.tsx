import { h } from 'preact'
import { route } from 'preact-router'
import { cleanup, fireEvent, debounceRenderingOff, render, waitForElement } from 'preact-testing-library'
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

  xit('sets the signature to the provided name', () => {
    debounceRenderingOff()
    const { getAllByText, getByPlaceholderText } = render(<App />)
    const field = getByPlaceholderText(/your name/i)
    const value = 'Test Name'
    fireEvent.input(field, { target: { value } }) // FIXME
    expect(getAllByText(value).length).toBeGreaterThan(1)
  })
})
