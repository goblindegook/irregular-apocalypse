import { h } from 'preact'
import { shallow } from 'preact-render-spy'
import { Header } from './index'

describe('Header', () => {
  it('renders title', () => {
    const context = shallow(<Header />)
    expect(context.find('h1').text()).toBe('Irregular Apocalypse')
  })
})
