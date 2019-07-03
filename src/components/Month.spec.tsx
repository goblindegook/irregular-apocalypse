import { h } from 'preact'
import { cleanup, fireEvent, render } from 'preact-testing-library'
import { Month, MonthProps } from './Month'

function createDay(date: Date, [am, pm]: [boolean, boolean]) {
  return {
    am: { starts: date, ends: date, checked: am },
    pm: { starts: date, ends: date, checked: pm }
  }
}

function renderMonth(props: Partial<MonthProps> = {}) {
  return render(
    <Month
      data={{}}
      month={8}
      name={'Test Name'}
      onChange={jest.fn()}
      signature={'https://test/signature.png'}
      year={2018}
      {...props}
    />
  )
}

describe('Month', () => {
  beforeEach(cleanup)

  describe('renders two checkboxes (morning and afternoon) for every day in the month', () => {
    it('renders 62 checkboxes for August 2018', () => {
      const { container } = renderMonth({ month: 8, year: 2018 })
      expect(container.querySelectorAll('input[type=checkbox]').length).toBe(62)
    })

    it('renders 60 checkboxes for September 2018', () => {
      const { container } = renderMonth({ month: 9, year: 2018 })
      expect(container.querySelectorAll('input[type=checkbox]').length).toBe(60)
    })

    it('renders 56 checkboxes for February 2019', () => {
      const { container } = renderMonth({ month: 2, year: 2019 })
      expect(container.querySelectorAll('input[type=checkbox]').length).toBe(56)
    })

    it('renders 58 checkboxes for February 2020', () => {
      const { container } = renderMonth({ month: 2, year: 2020 })
      expect(container.querySelectorAll('input[type=checkbox]').length).toBe(58)
    })
  })

  it('renders signature when checkbox is checked', () => {
    const name = 'Test Signature'
    const signature = 'https://test/signature.png'
    const date = new Date('2018-08-01 09:00:00')
    const data = { 1: createDay(date, [true, false]) }

    const { getByLabelText } = renderMonth({ month: 8, year: 2018, name, signature, data })

    const checkbox = getByLabelText(/wed/i) as HTMLInputElement
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const img = checkbox.parentElement!.querySelector('img')!
    expect(img.getAttribute('alt')).toEqual(name)
    expect(img.getAttribute('src')).toEqual(signature)
  })

  it('does not render signature when checkbox is unchecked', () => {
    const signature = 'https://test/signature.png'
    const date = new Date('2018-08-01 09:00:00')
    const data = { 1: createDay(date, [true, false]) }

    const { getByLabelText } = renderMonth({ month: 8, year: 2018, signature, data })

    const checkbox = getByLabelText(/sun/i) as HTMLInputElement
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const img = checkbox.parentElement!.querySelector('img')
    expect(img).toBeNull()
  })

  it('does not render time fields when checkbox is unchecked', () => {
    const { getByLabelText } = renderMonth({ month: 8, year: 2018 })
    const checkbox = getByLabelText(/sun/i) as HTMLInputElement
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const fields = checkbox.parentElement!.querySelectorAll('input[type=text]')
    expect(fields.length).toBe(0)
  })

  it('checks periods with checked=true', () => {
    const date = new Date('2018-08-01 09:00:00')
    const data = { 1: createDay(date, [true, false]) }
    const { getByLabelText } = renderMonth({ month: 8, year: 2018, data })
    const checkbox = getByLabelText(/wed/i) as HTMLInputElement
    expect(checkbox.checked).toBeTruthy()
  })

  it('unchecks periods with checked=false', () => {
    const date = new Date('2018-08-01 09:00:00')
    const data = { 1: createDay(date, [false, false]) }
    const { getByLabelText } = renderMonth({ month: 8, year: 2018, data })
    const checkbox = getByLabelText(/wed/i) as HTMLInputElement
    expect(checkbox.checked).toBeFalsy()
  })

  it('invokes callback when checkbox is checked', () => {
    const onChange = jest.fn()
    const date = new Date('2018-08-01 09:00:00')
    const data = { 1: createDay(date, [false, false]) }

    const { getByLabelText } = renderMonth({ month: 8, year: 2018, data, onChange })

    fireEvent.click(getByLabelText(/wed/i) as HTMLInputElement)
    expect(onChange.mock.calls[0][0]).toMatchObject({ checked: true })
  })

  it('invokes callback when checkbox is unchecked', () => {
    const onChange = jest.fn()
    const date = new Date('2018-08-01 09:00:00')
    const data = { 1: createDay(date, [true, false]) }

    const { getByLabelText } = renderMonth({ month: 8, year: 2018, data, onChange })

    fireEvent.click(getByLabelText(/wed/i) as HTMLInputElement)
    expect(onChange.mock.calls[0][0]).toMatchObject({ checked: false })
  })

  it('invokes callback when start time field is changed', () => {
    const onChange = jest.fn()
    const date = new Date('2018-08-01 09:00:00')
    const data = { 1: createDay(date, [true, false]) }

    const { getByPlaceholderText } = renderMonth({ month: 8, year: 2018, data, onChange })

    const field = getByPlaceholderText(/start time/i) as HTMLInputElement
    const value = '08:15'

    field.value = value
    fireEvent.input(field)
    fireEvent.change(field, { target: { value } })

    expect(onChange).toHaveBeenCalledWith({
      starts: new Date(2018, 7, 1, 8, 15),
      ends: date,
      checked: true
    })
  })

  it('invokes callback when end time field is changed', () => {
    const onChange = jest.fn()
    const date = new Date('2018-08-01 09:00:00')
    const data = { 1: createDay(date, [true, false]) }

    const { getByPlaceholderText } = renderMonth({ month: 8, year: 2018, data, onChange })

    const field = getByPlaceholderText(/end time/i) as HTMLInputElement
    const value = '12:55'

    field.value = value
    fireEvent.input(field)
    fireEvent.change(field, { target: { value } })

    expect(onChange).toHaveBeenCalledWith({
      starts: date,
      ends: new Date(2018, 7, 1, 12, 55),
      checked: true
    })
  })
})
