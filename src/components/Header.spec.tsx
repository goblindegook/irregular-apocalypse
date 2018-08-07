import { h } from 'preact'
import { cleanup, render } from 'preact-testing-library'
import { Header } from './Header'

describe('Header', () => {
  afterEach(cleanup)
  
  it('renders title', () => {
    const { getByText } = render(<Header />)
    expect(getByText('Irregular Apocalypse').tagName).toBe('H1')
  })

  it('links to /profile', () => {
    const { getByText } = render(<Header />)
    expect(getByText(/Me/).getAttribute('href')).toBe('/profile')
  })

  it('links to /profile/john', () => {
    const { getByText } = render(<Header />)
    expect(getByText(/John/).getAttribute('href')).toBe('/profile/john')
  })
})
