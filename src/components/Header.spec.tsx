import { h } from 'preact'
import { render } from 'preact-testing-library'
import { Header } from './Header'

describe('Header', () => {
  it('renders title', () => {
    const { getByText } = render(<Header />)
    expect(getByText('Irregular Apocalypse').tagName).toBe('H1')
  })
})
