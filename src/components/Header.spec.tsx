import { createElement } from 'preact'
import { cleanup, render, fireEvent } from 'preact-testing-library'
import { Header, HeaderProps } from './Header'

function renderHeader({
  name,
  year = 2019,
  month = 4,
  onNameChange = jest.fn()
}: Partial<HeaderProps>) {
  return render(
    <Header
      name={name}
      month={month}
      year={year}
      onNameChange={onNameChange}
      onSignatureChange={jest.fn()}
    />
  )
}

describe('Header', () => {
  beforeEach(cleanup)

  it('renders month name and year in the title', () => {
    const { getByText } = renderHeader({ year: 2012, month: 12 })
    expect(getByText('December 2012')).toBeTruthy()
  })

  it('links to the previous month', () => {
    const { getByTitle } = renderHeader({ year: 2018, month: 1 })
    const link = getByTitle('Previous') as HTMLAnchorElement
    expect(link.getAttribute('href')).toBe('/2017/12')
  })

  it('links to the following month', () => {
    const { getByTitle } = renderHeader({ year: 2017, month: 12 })
    const link = getByTitle('Next') as HTMLAnchorElement
    expect(link.getAttribute('href')).toBe('/2018/01')
  })

  it('sets the default name', () => {
    const name = 'Test Name'
    const { getByPlaceholderText } = renderHeader({ name })
    const field = getByPlaceholderText(/your name/i) as HTMLInputElement
    expect(field.value).toBe(name)
  })

  it('handles name field changes', () => {
    const onNameChange = jest.fn()
    const { getByPlaceholderText } = renderHeader({ onNameChange })
    const field = getByPlaceholderText(/your name/i) as HTMLInputElement
    const name = 'Test Name'
    field.value = name
    fireEvent.input(field)
    expect(onNameChange).toHaveBeenCalledWith(name)
  })
})
