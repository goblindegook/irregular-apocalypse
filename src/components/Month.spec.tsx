import { h } from 'preact'
import { cleanup, render } from 'preact-testing-library'
import { Month } from './Month'

describe('Month', () => {
  afterEach(cleanup)

  it('renders month name and year', () => {
    const { getByText } = render(<Month month={12} year={2012} />)
    expect(getByText('December 2012')).toBeTruthy()
  })
})
