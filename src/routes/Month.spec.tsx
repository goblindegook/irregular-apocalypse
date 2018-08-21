import { h } from 'preact'
import { cleanup, fireEvent, debounceRenderingOff, render } from 'preact-testing-library'
import { Month } from './Month'
import { Period } from '../calendar'

describe('Month', () => {
  const NAME = 'Test Signature'
  const SIGNATURE = 'https://test/signature.png'
  const ON_CHANGE = async (period: Period) => { /* noop */ }

  afterEach(cleanup)

  it('renders month name and year', () => {
    const { getByText } = render(<Month name='' signature='' month={12} year={2012} onPeriodChange={ON_CHANGE} />)
    expect(getByText('December 2012')).toBeTruthy()
  })

  it('renders signature when checkbox is checked', () => {
    const { getByLabelText } = render(<Month name={NAME} signature={SIGNATURE} month={8} year={2018} onPeriodChange={ON_CHANGE} />)
    const checkbox = getByLabelText(/mon/i)
    const img = checkbox.parentElement!.querySelector('img')
    expect(img!.getAttribute('alt')).toEqual(NAME)
    expect(img!.getAttribute('src')).toEqual(SIGNATURE)
  })

  it('does not render signature when checkbox is unchecked', () => {
    const { getByLabelText } = render(<Month name='' signature='' month={8} year={2018} onPeriodChange={ON_CHANGE} />)
    const checkbox = getByLabelText(/sun/i)
    const img = checkbox.parentElement!.querySelector('img')
    expect(img).toBeNull()
  })

  it('checks periods with checked=true', () => {
    const date = new Date('2018-08-04 09:00:00')
    const periods = { '2018-08': { 4: { am: { starts: date, ends: date, checked: true } } } }
    const { getByLabelText } = render(<Month periods={periods} name='' signature='' month={8} year={2018} onPeriodChange={ON_CHANGE} />)
    const checkbox = getByLabelText(/sat/i) as HTMLInputElement
    expect(checkbox.checked).toBeTruthy()
  })

  it('unchecks periods with checked=false', () => {
    const date = new Date('2018-08-01 09:00:00')
    const periods = { '2018-08': { 1: { am: { starts: date, ends: date, checked: false } } } }
    const { getByLabelText } = render(<Month periods={periods} name='' signature='' month={8} year={2018} onPeriodChange={ON_CHANGE} />)
    const checkbox = getByLabelText(/wed/i) as HTMLInputElement
    expect(checkbox.checked).toBeFalsy()
  })

  it('invokes callback when checkbox is unchecked', () => {
    const fn = jest.fn()
    const { getByLabelText } = render(<Month name='' signature='' month={8} year={2018} onPeriodChange={fn} />)
    const input = getByLabelText(/mon/i)
    fireEvent.click(input)
    expect(fn.mock.calls[0][0]).toMatchObject({ checked: false })
  })

  it('invokes callback when checkbox is checked', () => {
    const fn = jest.fn()
    const { getByLabelText } = render(<Month name='' signature='' month={8} year={2018} onPeriodChange={fn} />)
    const input = getByLabelText(/sun/i)
    fireEvent.click(input)
    expect(fn.mock.calls[0][0]).toMatchObject({ checked: true })
  })
})
