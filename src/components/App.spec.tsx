import { h } from 'preact'
import { route } from 'preact-router'
import { cleanup, render } from 'preact-testing-library'
import { App } from './App'

describe('App', () => {
  afterEach(cleanup)

  it('routes default profile', () => {
    const { getByText } = render(<App />)
    route('/profile')
    expect(getByText('Profile: me')).toBeTruthy()
  })

  it('routes named profile', () => {
    const { getByText } = render(<App />)
    route('/profile/foo')
    expect(getByText('Profile: foo')).toBeTruthy()
  })
})
