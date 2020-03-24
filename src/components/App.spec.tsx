import { createElement } from 'preact'
import { route } from 'preact-router'
import { cleanup, fireEvent, render } from '@testing-library/preact'
import { format } from 'date-fns'
import { App } from './App'
import { extend } from '../test/helpers'

function renderApp() {
  return extend(render(<App />))
}

describe('App', () => {
  beforeEach(cleanup)

  it('routes default view', () => {
    const date = new Date()
    const { getByText } = renderApp()
    route('')
    expect(getByText(format(date, 'MMMM yyyy'))).toBeTruthy()
  })

  it('routes month view', async () => {
    const { findByText } = renderApp()
    route('/2018/05')
    expect(await findByText('May 2018')).toBeTruthy()
  })

  it('includes the name in the title', () => {
    render(<App />)
    route('/2018/05')
    expect(document.title).toContain('May 2018')
  })

  it('includes the name in the title', () => {
    const { getByPlaceholderText } = renderApp()
    const field = getByPlaceholderText(/your name/i) as HTMLInputElement
    const name = 'Test Name'
    field.value = name
    fireEvent.input(field)
    expect(document.title).toContain(name)
  })

  describe('default values', () => {
    it('renders start time fields with defaults for morning and afternoon', () => {
      const { getAllByPlaceholderText } = renderApp()
      const fields = getAllByPlaceholderText(/start time/i) as HTMLInputElement[]
      expect(fields.map((f) => f.value)).toEqual(expect.arrayContaining(['09:00', '14:00']))
    })

    it('renders end time fields with defaults for morning and afternoon', () => {
      const { getAllByPlaceholderText } = renderApp()
      const fields = getAllByPlaceholderText(/end time/i) as HTMLInputElement[]
      expect(fields.map((f) => f.value)).toEqual(expect.arrayContaining(['13:00', '17:30']))
    })

    it('checks working days by default', () => {
      const { getFirstByLabelText } = renderApp()
      const checkbox = getFirstByLabelText<HTMLInputElement>(/fri/i)
      expect(checkbox.checked).toBe(true)
    })

    it('does not check Saturdays by default', () => {
      const { getFirstByLabelText } = renderApp()
      const checkbox = getFirstByLabelText<HTMLInputElement>(/sat/i)
      expect(checkbox.checked).toBe(false)
    })

    it('does not check Sundays by default', () => {
      const { getFirstByLabelText } = renderApp()
      const checkbox = getFirstByLabelText<HTMLInputElement>(/sun/i)
      expect(checkbox.checked).toBe(false)
    })

    it('does not check holidays by default', () => {
      const { getFirstByLabelText } = renderApp()
      route('/2019/01')
      const checkbox = getFirstByLabelText<HTMLInputElement>(/tue/i)
      expect(checkbox.checked).toBe(false)
    })
  })

  it('clears signature when period is unchecked', () => {
    const { getFirstByLabelText } = renderApp()
    const checkbox = getFirstByLabelText<HTMLInputElement>(/mon/i)
    fireEvent.click(checkbox)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const img = checkbox.parentElement!.querySelector('img')
    expect(img).toBeNull()
  })

  it('adds signature when period is checked', () => {
    const { getFirstByLabelText } = renderApp()
    const checkbox = getFirstByLabelText<HTMLInputElement>(/sun/i)
    fireEvent.click(checkbox)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const img = checkbox.parentElement!.querySelector('img')
    expect(img).not.toBeNull()
  })
})
