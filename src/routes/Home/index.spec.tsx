import { h } from 'preact'
import { cleanup, render } from 'preact-testing-library'
import { Home } from './index'

describe('Home', () => {
  afterEach(cleanup)
  
  it('renders title', () => {
    const { getByText } = render(<Home path='/' />)
    expect(getByText('Home').tagName).toBe('H1')
  })
})
