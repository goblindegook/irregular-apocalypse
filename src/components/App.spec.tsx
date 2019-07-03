import { h } from 'preact'
import { route } from 'preact-router'
import { cleanup, fireEvent, debounceRenderingOff, render } from 'preact-testing-library'
import { format } from 'date-fns'
import { App } from './App'

describe('App', () => {
  beforeEach(cleanup)

  it('routes default view', () => {
    const date = new Date()
    const { getByText } = render(<App />)
    route('')
    expect(getByText(format(date, 'MMMM YYYY'))).toBeTruthy()
  })

  it('routes month view', () => {
    const { getByText } = render(<App />)
    route('/2018/05')
    expect(getByText('May 2018')).toBeTruthy()
  })

  it('includes the name in the title', () => {
    debounceRenderingOff()
    render(<App />)
    route('/2018/05')
    expect(document.title).toContain('May 2018')
  })

  it('includes the name in the title', () => {
    debounceRenderingOff()
    const { getByPlaceholderText } = render(<App />)
    const field = getByPlaceholderText(/your name/i) as HTMLInputElement
    const name = 'Test Name'
    field.value = name
    fireEvent.input(field)
    expect(document.title).toContain(name)
  })

  describe('default values', () => {
    it('renders start time fields with defaults for morning and afternoon', () => {
      const { getAllByPlaceholderText } = render(<App />)
      const fields = getAllByPlaceholderText(/start time/i) as HTMLInputElement[]
      expect(fields.map(f => f.value)).toEqual(expect.arrayContaining(['09:00', '14:00']))
    })

    it('renders end time fields with defaults for morning and afternoon', () => {
      const { getAllByPlaceholderText } = render(<App />)
      const fields = getAllByPlaceholderText(/end time/i) as HTMLInputElement[]
      expect(fields.map(f => f.value)).toEqual(expect.arrayContaining(['13:00', '17:30']))
    })

    it('checks working days by default', () => {
      const { getByLabelText } = render(<App />)
      const checkbox = getByLabelText(/fri/i) as HTMLInputElement
      expect(checkbox.checked).toBe(true)
    })

    it('does not check Saturdays by default', () => {
      const { getByLabelText } = render(<App />)
      const checkbox = getByLabelText(/sat/i) as HTMLInputElement
      expect(checkbox.checked).toBe(false)
    })

    it('does not check Sundays by default', () => {
      const { getByLabelText } = render(<App />)
      const checkbox = getByLabelText(/sun/i) as HTMLInputElement
      expect(checkbox.checked).toBe(false)
    })

    it('does not check holidays by default', () => {
      const { getByLabelText } = render(<App />)
      route('/2019/01')
      const checkbox = getByLabelText(/tue/i) as HTMLInputElement
      expect(checkbox.checked).toBe(false)
    })
  })

  it('clears signature when period is unchecked', () => {
    debounceRenderingOff()
    const { getByLabelText } = render(<App />)
    const checkbox = getByLabelText(/mon/i) as HTMLInputElement
    fireEvent.click(checkbox)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const img = checkbox.parentElement!.querySelector('img')
    expect(img).toBeNull()
  })

  it('adds signature when period is checked', () => {
    debounceRenderingOff()
    const { getByLabelText } = render(<App />)
    const checkbox = getByLabelText(/sun/i) as HTMLInputElement
    fireEvent.click(checkbox)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const img = checkbox.parentElement!.querySelector('img')
    expect(img).not.toBeNull()
  })
})
