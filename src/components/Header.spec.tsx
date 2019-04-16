import { h } from 'preact'
import { cleanup, render, fireEvent } from 'preact-testing-library'
import { Header } from './Header'

function renderHeader(year: number, month: number) {
  return render(
    <Header month={month} year={year} onNameChange={jest.fn()} onSignatureChange={jest.fn()} />
  )
}

describe('Header', () => {
  beforeEach(cleanup)

  it('renders month name and year in the title', () => {
    const { getByText } = renderHeader(2012, 12)
    expect(getByText('December 2012')).toBeTruthy()
  })

  it('links to the previous month', () => {
    const { getByTitle } = renderHeader(2018, 1)
    expect(getByTitle('Previous').getAttribute('href')).toBe('/2017/12')
  })

  it('links to the following month', () => {
    const { getByTitle } = renderHeader(2017, 12)
    expect(getByTitle('Next').getAttribute('href')).toBe('/2018/01')
  })

  it('sets the default name', () => {
    const name = 'Test Name'
    const { getByPlaceholderText } = renderHeader(2012, 12)
    const field = getByPlaceholderText(/your name/i) as HTMLInputElement
    expect(field.value).toBe(name)
  })

  it('handles name field changes', () => {
    const fn = jest.fn()
    const { getByPlaceholderText } = render(
      <Header month={12} year={2012} onNameChange={fn} onSignatureChange={jest.fn()} />
    )
    const field = getByPlaceholderText(/your name/i) as HTMLInputElement
    const name = 'Test Name'
    field.value = name
    fireEvent.input(field)
    expect(fn).toHaveBeenCalledWith(name)
  })
})
