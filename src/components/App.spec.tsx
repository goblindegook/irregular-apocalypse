import { h } from 'preact'
import { route } from 'preact-router'
import { cleanup, render } from 'preact-testing-library'
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
})
