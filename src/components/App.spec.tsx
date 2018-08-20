import { h } from 'preact'
import { route } from 'preact-router'
import { cleanup, fireEvent, debounceRenderingOff, render } from 'preact-testing-library'
import { format } from 'date-fns'
import { App } from './App'

describe('App', () => {
  afterEach(cleanup)

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

  it('sets the name', () => {
    debounceRenderingOff()
    const { getAllByAltText, getByPlaceholderText } = render(<App />)
    const field = getByPlaceholderText(/your name/i) as HTMLInputElement
    const name = 'Test Name'
    field.value = name
    fireEvent.input(field)
    expect(getAllByAltText(name).length).toBeGreaterThan(1)
  })

  xit('sets the signature', () => {
    // FIXME: How to test file inputs?
    debounceRenderingOff()
    const fn = jest.fn()
    const { container, getByLabelText } = render(<App />)
    const field = getByLabelText(/signature/i) as HTMLInputElement
    const value = new File([], 'signature.png')
    fireEvent.change(field, { target: { value } })
    expect(container.querySelectorAll('img').length).toBeGreaterThan(0)
  })

  describe('renders two checkboxes (morning and afternoon) for every day in the month', () => {
    it('renders 62 checkboxes for August 2018', () => {
      const { container } = render(<App />)
      route('/2018/08')
      expect(container.querySelectorAll('input[type=checkbox]').length).toBe(62)
    })

    it('renders 60 checkboxes for September 2018', () => {
      const { container } = render(<App />)
      route('/2018/09')
      expect(container.querySelectorAll('input[type=checkbox]').length).toBe(60)
    })

    it('renders 56 checkboxes for February 2019', () => {
      const { container } = render(<App />)
      route('/2019/02')
      expect(container.querySelectorAll('input[type=checkbox]').length).toBe(56)
    })

    it('renders 58 checkboxes for February 2020', () => {
      const { container } = render(<App />)
      route('/2020/02')
      expect(container.querySelectorAll('input[type=checkbox]').length).toBe(58)
    })

    it('renders 31 morning labels for August 2018', () => {
      const { getAllByLabelText } = render(<App />)
      route('/2018/08')
      expect(getAllByLabelText(/9\:00–13\:00/i).length).toBe(31)
    })

    it('renders 31 afternoon labels for August 2018', () => {
      const { getAllByLabelText } = render(<App />)
      route('/2018/08')
      expect(getAllByLabelText(/14\:00–17\:30/i).length).toBe(31)
    })
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

  it('clears signature when period is unchecked', () => {
    debounceRenderingOff()
    const { getByLabelText } = render(<App />)
    const checkbox = getByLabelText(/mon/i)
    fireEvent.click(checkbox)
    const img = checkbox.parentElement!.querySelector('img')
    expect(img).toBeNull()
  })

  it('adds signature when period is checked', () => {
    debounceRenderingOff()
    const { getByLabelText } = render(<App />)
    const checkbox = getByLabelText(/sun/i)
    fireEvent.click(checkbox)
    const img = checkbox.parentElement!.querySelector('img')
    expect(img).not.toBeNull()
  })
})
