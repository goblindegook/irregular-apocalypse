import { h } from 'preact'
import { render } from 'preact-testing-library'
import { Home } from './index'

describe('Home', () => {
  it('renders title', () => {
    const { getByText } = render(<Home path='/' />)
    expect(getByText('Home').tagName).toBe('H1')
  })
})
