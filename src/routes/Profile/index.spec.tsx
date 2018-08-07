import { h } from 'preact'
import { Profile } from './index'
import { cleanup, debounceRenderingOff, render, fireEvent } from 'preact-testing-library'

describe('Profile', () => {
  afterEach(cleanup)

  it('renders user name in title', () => {
    const { getByText } = render(<Profile path='/' user='foo' />)
    expect(getByText('Profile: foo').tagName).toBe('H1')
  })

  it('renders the current time', () => {
    const { getByText } = render(<Profile path='/' user='' />)
    expect(getByText('Current time').textContent).toBe(`Current time: ${new Date().toLocaleString()}`)
  })

  it('renders a counter starting at 10', () => {
    const { getByText } = render(<Profile path='/' user='' />)
    expect(getByText('Clicked').textContent).toMatch('Clicked 10 times.')
  })

  it('renders an increment button', () => {
    debounceRenderingOff()
    const { getByText } = render(<Profile path='/' user='' />)
    fireEvent.click(getByText('Click Me'))
    expect(getByText('Clicked').textContent).toMatch('Clicked 11 times.')
  })
})
