import { h } from 'preact'
import { cleanup, fireEvent, debounceRenderingOff, render } from 'preact-testing-library'
import { Month } from './Month'

describe('Month', () => {
  const SIGNATURE = 'https://test/signature.png'
  const NAME = 'Test Signature'

  afterEach(cleanup)

  it('renders month name and year', () => {
    const { getByText } = render(<Month name='' month={12} year={2012} />)
    expect(getByText('December 2012')).toBeTruthy()
  })

  describe('renders two labels (morning and afternoon) for every day in the month', () => {
    it('renders 31 morning labels for August 2018', () => {
      const { getAllByLabelText } = render(<Month name='' month={8} year={2018} />)
      expect(getAllByLabelText(/morning/i).length).toBe(31)
    })

    it('renders 31 afternoon labels for August 2018', () => {
      const { getAllByLabelText } = render(<Month name='' month={8} year={2018} />)
      expect(getAllByLabelText(/afternoon/i).length).toBe(31)
    })

    it('renders 30 morning labels for September 2018', () => {
      const { getAllByLabelText } = render(<Month name='' month={9} year={2018} />)
      expect(getAllByLabelText(/morning/i).length).toBe(30)
    })

    it('renders 30 afternoon labels for September 2018', () => {
      const { getAllByLabelText } = render(<Month name='' month={9} year={2018} />)
      expect(getAllByLabelText(/afternoon/i).length).toBe(30)
    })

    it('renders 28 morning labels for February 2019', () => {
      const { getAllByLabelText } = render(<Month name='' month={2} year={2019} />)
      expect(getAllByLabelText(/morning/i).length).toBe(28)
    })

    it('renders 28 afternoon labels for February 2019', () => {
      const { getAllByLabelText } = render(<Month name='' month={2} year={2019} />)
      expect(getAllByLabelText(/afternoon/i).length).toBe(28)
    })

    it('renders 29 morning labels for February 2020', () => {
      const { getAllByLabelText } = render(<Month name='' month={2} year={2020} />)
      expect(getAllByLabelText(/morning/i).length).toBe(29)
    })

    it('renders 29 afternoon labels for February 2020', () => {
      const { getAllByLabelText } = render(<Month name='' month={2} year={2020} />)
      expect(getAllByLabelText(/afternoon/i).length).toBe(29)
    })
  })

  it('checks working days by default', () => {
    const { getByLabelText } = render(<Month name='' month={8} year={2018} />)
    const checkbox = getByLabelText(/friday/i) as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })

  it('does not check Saturdays by default', () => {
    const { getByLabelText } = render(<Month name='' month={8} year={2018} />)
    const checkbox = getByLabelText(/saturday/i) as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })

  it('does not check Sundays by default', () => {
    const { getByLabelText } = render(<Month name='' month={8} year={2018} />)
    const checkbox = getByLabelText(/sunday/i) as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })

  it('clears signature when checkbox is unchecked', () => {
    debounceRenderingOff()
    const { getByLabelText } = render(<Month name={NAME} signature={SIGNATURE} month={8} year={2018} />)
    const input = getByLabelText(/monday/i)
    fireEvent.click(input)
    const img = input.parentElement!.querySelector('img')
    expect(img).toBeNull()
  })

  it('renders signature when checkbox is checked', () => {
    debounceRenderingOff()
    const { getByLabelText } = render(<Month name={NAME} signature={SIGNATURE} month={8} year={2018} />)
    const input = getByLabelText(/sunday/i)
    fireEvent.click(input)
    const img = input.parentElement!.querySelector('img')
    expect(img!.getAttribute('alt')).toEqual(NAME)
    expect(img!.getAttribute('src')).toEqual(SIGNATURE)
  })
})
