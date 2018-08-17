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
