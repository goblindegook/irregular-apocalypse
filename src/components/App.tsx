import { h, Component } from 'preact'
import { Router, RouterOnChangeArgs } from 'preact-router'
import { Header } from './Header'
import { Month } from '../routes/Month'

interface AppState {
  name: string
}

export class App extends Component<{}, AppState> {
  currentUrl = ''

  constructor () {
    super()

    this.state = {
      name: ''
    }
  }

  handleRoute = (e: RouterOnChangeArgs) => {
    this.currentUrl = e.url
  }

  handleInput = (e: any) => {
    console.log(e, e.target)
    this.setState({ name: e.target.value })
  }

  render ({}, { name }: AppState) {
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return (
      <div id='app'>
        <Header />
        <input placeholder='Your name' value={name} onInput={this.handleInput} />
        <Router onChange={this.handleRoute}>
          <Month signature={name} path='/' month={month} year={year} />
          <Month signature={name} path='/:year/:month' month={month} year={year} />
        </Router>
      </div>
    )
  }
}
