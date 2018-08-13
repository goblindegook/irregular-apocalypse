import { h } from 'preact'
import { cleanup, render } from 'preact-testing-library'
import { Month } from './Month'

describe('Month', () => {
  afterEach(cleanup)

  it('renders month name and year', () => {
    const { getByText } = render(<Month month={12} year={2012} />)
    expect(getByText('December 2012')).toBeTruthy()
  })

  describe('renders two labels (morning and afternoon) for every day in the month', () => {
    it('renders 31 morning labels for August 2018', () => {
      const { getAllByLabelText } = render(<Month month={8} year={2018} />)
      expect(getAllByLabelText(/morning/i).length).toBe(31)
    })

    it('renders 31 afternoon labels for August 2018', () => {
      const { getAllByLabelText } = render(<Month month={8} year={2018} />)
      expect(getAllByLabelText(/afternoon/i).length).toBe(31)
    })

    it('renders 30 morning labels for September 2018', () => {
      const { getAllByLabelText } = render(<Month month={9} year={2018} />)
      expect(getAllByLabelText(/morning/i).length).toBe(30)
    })

    it('renders 30 afternoon labels for September 2018', () => {
      const { getAllByLabelText } = render(<Month month={9} year={2018} />)
      expect(getAllByLabelText(/afternoon/i).length).toBe(30)
    })

    it('renders 28 morning labels for February 2019', () => {
      const { getAllByLabelText } = render(<Month month={2} year={2019} />)
      expect(getAllByLabelText(/morning/i).length).toBe(28)
    })

    it('renders 28 afternoon labels for February 2019', () => {
      const { getAllByLabelText } = render(<Month month={2} year={2019} />)
      expect(getAllByLabelText(/afternoon/i).length).toBe(28)
    })

    it('renders 29 morning labels for February 2020', () => {
      const { getAllByLabelText } = render(<Month month={2} year={2020} />)
      expect(getAllByLabelText(/morning/i).length).toBe(29)
    })

    it('renders 29 afternoon labels for February 2020', () => {
      const { getAllByLabelText } = render(<Month month={2} year={2020} />)
      expect(getAllByLabelText(/afternoon/i).length).toBe(29)
    })
  })
})
