import { h } from 'preact'
import { cleanup, fireEvent, render } from 'preact-testing-library'
import { Month } from './Month'
import { Period } from '../calendar'

describe('Month', () => {
  const NAME = 'Test Signature'
  const SIGNATURE = 'https://test/signature.png'
  const ON_CHANGE = async (period: Period) => { /* noop */ }

  afterEach(cleanup)

  describe('renders two checkboxes (morning and afternoon) for every day in the month', () => {
    it('renders 62 checkboxes for August 2018', () => {
      const { container } = render(<Month name={NAME} signature={SIGNATURE} month={8} year={2018} onPeriodChange={ON_CHANGE} />)
      expect(container.querySelectorAll('input[type=checkbox]').length).toBe(62)
    })

    it('renders 60 checkboxes for September 2018', () => {
      const { container } = render(<Month name={NAME} signature={SIGNATURE} month={9} year={2018} onPeriodChange={ON_CHANGE} />)
      expect(container.querySelectorAll('input[type=checkbox]').length).toBe(60)
    })

    it('renders 56 checkboxes for February 2019', () => {
      const { container } = render(<Month name={NAME} signature={SIGNATURE} month={2} year={2019} onPeriodChange={ON_CHANGE} />)
      expect(container.querySelectorAll('input[type=checkbox]').length).toBe(56)
    })

    it('renders 58 checkboxes for February 2020', () => {
      const { container } = render(<Month name={NAME} signature={SIGNATURE} month={2} year={2020} onPeriodChange={ON_CHANGE} />)
      expect(container.querySelectorAll('input[type=checkbox]').length).toBe(58)
    })

    it('renders start time fields with defaults for morning and afternoon', () => {
      const { getAllByPlaceholderText } = render(<Month name={NAME} signature={SIGNATURE} month={8} year={2018} onPeriodChange={ON_CHANGE} />)
      const fields = getAllByPlaceholderText(/start time/i) as HTMLInputElement[]
      expect(fields.map(f => f.value)).toEqual(expect.arrayContaining(['09:00', '14:00']))
    })

    it('renders end time fields with defaults for morning and afternoon', () => {
      const { getAllByPlaceholderText } = render(<Month name={NAME} signature={SIGNATURE} month={8} year={2018} onPeriodChange={ON_CHANGE} />)
      const fields = getAllByPlaceholderText(/end time/i) as HTMLInputElement[]
      expect(fields.map(f => f.value)).toEqual(expect.arrayContaining(['13:00', '17:30']))
    })
  })

  it('checks working days by default', () => {
    const { getByLabelText } = render(<Month name={NAME} signature={SIGNATURE} month={8} year={2018} onPeriodChange={ON_CHANGE} />)
    const checkbox = getByLabelText(/fri/i) as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })

  it('does not check Saturdays by default', () => {
    const { getByLabelText } = render(<Month name={NAME} signature={SIGNATURE} month={8} year={2018} onPeriodChange={ON_CHANGE} />)
    const checkbox = getByLabelText(/sat/i) as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })

  it('does not check Sundays by default', () => {
    const { getByLabelText } = render(<Month name={NAME} signature={SIGNATURE} month={8} year={2018} onPeriodChange={ON_CHANGE} />)
    const checkbox = getByLabelText(/sun/i) as HTMLInputElement
    expect(checkbox.checked).toBe(false)
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

  it('does not render time fields when checkbox is unchecked', () => {
    const { getByLabelText } = render(<Month name='' signature='' month={8} year={2018} onPeriodChange={ON_CHANGE} />)
    const checkbox = getByLabelText(/sun/i)
    const fields = checkbox.parentElement!.querySelectorAll('input[type=text]')
    expect(fields.length).toBe(0)
  })

  it('checks periods with checked=true', () => {
    const date = new Date('2018-08-04 09:00:00')
    const data = {
      4: {
        am: { starts: date, ends: date, checked: true },
        pm: { starts: date, ends: date, checked: false }
      }
    }
    const { getByLabelText } = render(<Month data={data} name='' signature='' month={8} year={2018} onPeriodChange={ON_CHANGE} />)
    const checkbox = getByLabelText(/sat/i) as HTMLInputElement
    expect(checkbox.checked).toBeTruthy()
  })

  it('unchecks periods with checked=false', () => {
    const date = new Date('2018-08-01 09:00:00')
    const data = {
      1: {
        am: { starts: date, ends: date, checked: false },
        pm: { starts: date, ends: date, checked: true }
      }
    }
    const { getByLabelText } = render(<Month data={data} name='' signature='' month={8} year={2018} onPeriodChange={ON_CHANGE} />)
    const checkbox = getByLabelText(/wed/i) as HTMLInputElement
    expect(checkbox.checked).toBeFalsy()
  })

  it('invokes callback when checkbox is toggled', () => {
    const fn = jest.fn()
    const { getByLabelText } = render(<Month name='' signature='' month={8} year={2018} onPeriodChange={fn} />)
    const checbox = getByLabelText(/mon/i) as HTMLInputElement
    fireEvent.click(checbox)
    expect(fn.mock.calls[0][0]).toMatchObject({ checked: !checbox.value })
  })

  it('invokes callback when start time field is changed', () => {
    const fn = jest.fn()
    const { getByPlaceholderText } = render(<Month name='' signature='' month={8} year={2018} onPeriodChange={fn} />)
    const field = getByPlaceholderText(/start time/i) as HTMLInputElement
    const value = '10:15'
    field.value = value
    fireEvent.input(field)
    fireEvent.change(field, { target: { value } })
    expect(fn.mock.calls[0][0]).toMatchObject({ starts: new Date(2018, 7, 1, 10, 15) })
  })

  it('invokes callback when end time field is changed', () => {
    const fn = jest.fn()
    const { getByPlaceholderText } = render(<Month name='' signature='' month={8} year={2018} onPeriodChange={fn} />)
    const field = getByPlaceholderText(/end time/i) as HTMLInputElement
    const value = '17:55'
    field.value = value
    fireEvent.input(field)
    fireEvent.change(field, { target: { value } })
    expect(fn.mock.calls[0][0]).toMatchObject({ ends: new Date(2018, 7, 1, 17, 55) })
  })

  it('does not invoke callback when fields are clicked', () => {
    const fn = jest.fn()
    const { getByPlaceholderText } = render(<Month name='' signature='' month={8} year={2018} onPeriodChange={fn} />)
    const startTime = getByPlaceholderText(/start time/i) as HTMLInputElement
    fireEvent.click(startTime)
    const endTime = getByPlaceholderText(/end time/i) as HTMLInputElement
    fireEvent.click(endTime)
    expect(fn).not.toHaveBeenCalled()
  })
})
