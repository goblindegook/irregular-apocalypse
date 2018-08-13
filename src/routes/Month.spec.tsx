import { h } from 'preact'
import { cleanup, fireEvent, debounceRenderingOff, render } from 'preact-testing-library'
import { Month } from './Month'

describe('Month', () => {
  const SIGNATURE = 'Test Signature'

  afterEach(cleanup)

  it('renders month name and year', () => {
    const { getByText } = render(<Month signature={SIGNATURE} month={12} year={2012} />)
    expect(getByText('December 2012')).toBeTruthy()
  })

  describe('renders two labels (morning and afternoon) for every day in the month', () => {
    it('renders 31 morning labels for August 2018', () => {
      const { getAllByLabelText } = render(<Month signature={SIGNATURE} month={8} year={2018} />)
      expect(getAllByLabelText(/morning/i).length).toBe(31)
    })

    it('renders 31 afternoon labels for August 2018', () => {
      const { getAllByLabelText } = render(<Month signature={SIGNATURE} month={8} year={2018} />)
      expect(getAllByLabelText(/afternoon/i).length).toBe(31)
    })

    it('renders 30 morning labels for September 2018', () => {
      const { getAllByLabelText } = render(<Month signature={SIGNATURE} month={9} year={2018} />)
      expect(getAllByLabelText(/morning/i).length).toBe(30)
    })

    it('renders 30 afternoon labels for September 2018', () => {
      const { getAllByLabelText } = render(<Month signature={SIGNATURE} month={9} year={2018} />)
      expect(getAllByLabelText(/afternoon/i).length).toBe(30)
    })

    it('renders 28 morning labels for February 2019', () => {
      const { getAllByLabelText } = render(<Month signature={SIGNATURE} month={2} year={2019} />)
      expect(getAllByLabelText(/morning/i).length).toBe(28)
    })

    it('renders 28 afternoon labels for February 2019', () => {
      const { getAllByLabelText } = render(<Month signature={SIGNATURE} month={2} year={2019} />)
      expect(getAllByLabelText(/afternoon/i).length).toBe(28)
    })

    it('renders 29 morning labels for February 2020', () => {
      const { getAllByLabelText } = render(<Month signature={SIGNATURE} month={2} year={2020} />)
      expect(getAllByLabelText(/morning/i).length).toBe(29)
    })

    it('renders 29 afternoon labels for February 2020', () => {
      const { getAllByLabelText } = render(<Month signature={SIGNATURE} month={2} year={2020} />)
      expect(getAllByLabelText(/afternoon/i).length).toBe(29)
    })
  })

  it('clears signature when checkbox is unchecked', () => {
    debounceRenderingOff()
    const { getByLabelText } = render(<Month signature={SIGNATURE} month={8} year={2018} />)
    const input = getByLabelText(/day 1 \(morning\)/i)
    fireEvent.click(input)
    expect(input.parentElement!.textContent).not.toContain('Signature')
  })

  it('renders signature when checkbox is checked', () => {
    debounceRenderingOff()
    const { getByLabelText } = render(<Month signature={SIGNATURE} month={8} year={2018} />)
    const input = getByLabelText(/day 1 \(morning\)/i)
    fireEvent.click(input)
    fireEvent.click(input)
    expect(input.parentElement!.textContent).toContain(SIGNATURE)
  })
})
