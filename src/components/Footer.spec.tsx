import { h } from 'preact'
import { cleanup, render } from 'preact-testing-library'
import { Footer } from './Footer'

describe('Footer', () => {
  afterEach(cleanup)

  xit('renders signature line', () => {
    const { getByText } = render(<Footer />)
    expect(getByText('Employer Signature')).toBeTruthy()
  })
})
