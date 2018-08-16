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
    it('renders 62 labels for August 2018', () => {
      const { container } = render(<Month name='' month={8} year={2018} />)
      expect(container.querySelectorAll('label').length).toBe(62)
    })

    it('renders 60 labels for September 2018', () => {
      const { container } = render(<Month name='' month={9} year={2018} />)
      expect(container.querySelectorAll('label').length).toBe(60)
    })

    it('renders 56 labels for February 2019', () => {
      const { container } = render(<Month name='' month={2} year={2019} />)
      expect(container.querySelectorAll('label').length).toBe(56)
    })

    it('renders 58 labels for February 2020', () => {
      const { container } = render(<Month name='' month={2} year={2020} />)
      expect(container.querySelectorAll('label').length).toBe(58)
    })

    it('renders 31 morning labels for August 2018', () => {
      const { getAllByLabelText } = render(<Month name='' month={8} year={2018} />)
      expect(getAllByLabelText(/9\:00–13\:00/i).length).toBe(31)
    })

    it('renders 31 afternoon labels for August 2018', () => {
      const { getAllByLabelText } = render(<Month name='' month={8} year={2018} />)
      expect(getAllByLabelText(/14\:00–17\:30/i).length).toBe(31)
    })
  })

  it('checks working days by default', () => {
    const { getByLabelText } = render(<Month name='' month={8} year={2018} />)
    const checkbox = getByLabelText(/fri/i) as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })

  it('does not check Saturdays by default', () => {
    const { getByLabelText } = render(<Month name='' month={8} year={2018} />)
    const checkbox = getByLabelText(/sat/i) as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })

  it('does not check Sundays by default', () => {
    const { getByLabelText } = render(<Month name='' month={8} year={2018} />)
    const checkbox = getByLabelText(/sun/i) as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })

  it('clears signature when checkbox is unchecked', () => {
    debounceRenderingOff()
    const { getByLabelText } = render(<Month name={NAME} signature={SIGNATURE} month={8} year={2018} />)
    const input = getByLabelText(/mon/i)
    fireEvent.click(input)
    const img = input.parentElement!.querySelector('img')
    expect(img).toBeNull()
  })

  it('renders signature when checkbox is checked', () => {
    debounceRenderingOff()
    const { getByLabelText } = render(<Month name={NAME} signature={SIGNATURE} month={8} year={2018} />)
    const input = getByLabelText(/sun/i)
    fireEvent.click(input)
    const img = input.parentElement!.querySelector('img')
    expect(img!.getAttribute('alt')).toEqual(NAME)
    expect(img!.getAttribute('src')).toEqual(SIGNATURE)
  })
})
