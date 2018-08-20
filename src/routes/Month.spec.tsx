import { h } from 'preact'
import { cleanup, fireEvent, debounceRenderingOff, render } from 'preact-testing-library'
import { Month } from './Month'
import { Period } from '../calendar'

describe('Month', () => {
  const SIGNATURE = 'https://test/signature.png'
  const NAME = 'Test Signature'
  const ON_CHANGE = async (period: Period) => {
    // noop
  }

  afterEach(cleanup)

  it('renders month name and year', () => {
    const { getByText } = render(<Month periods={{}} name='' month={12} year={2012} onPeriodChange={ON_CHANGE} />)
    expect(getByText('December 2012')).toBeTruthy()
  })

  it('renders signature when checkbox is checked', () => {
    const { getByLabelText } = render(<Month periods={{}} name={NAME} signature={SIGNATURE} month={8} year={2018} onPeriodChange={ON_CHANGE} />)
    const input = getByLabelText(/mon/i)
    const img = input.parentElement!.querySelector('img')
    expect(img!.getAttribute('alt')).toEqual(NAME)
    expect(img!.getAttribute('src')).toEqual(SIGNATURE)
  })

  it('does not render signature when checkbox is unchecked', () => {
    const { getByLabelText } = render(<Month periods={{}} name={NAME} signature={SIGNATURE} month={8} year={2018} onPeriodChange={ON_CHANGE} />)
    const input = getByLabelText(/sun/i)
    const img = input.parentElement!.querySelector('img')
    expect(img).toBeNull()
  })

  it('invokes callback when checkbox is unchecked', () => {
    const fn = jest.fn()
    const { getByLabelText } = render(<Month periods={{}} name={NAME} signature={SIGNATURE} month={8} year={2018} onPeriodChange={fn} />)
    const input = getByLabelText(/mon/i)
    fireEvent.click(input)
    expect(fn.mock.calls[0][0]).toMatchObject({ checked: false })
  })

  it('invokes callback when checkbox is checked', () => {
    const fn = jest.fn()
    const { getByLabelText } = render(<Month periods={{}} name={NAME} signature={SIGNATURE} month={8} year={2018} onPeriodChange={fn} />)
    const input = getByLabelText(/sun/i)
    fireEvent.click(input)
    expect(fn.mock.calls[0][0]).toMatchObject({ checked: true })
  })
})
