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

  handleRouteChange = (e: RouterOnChangeArgs) => {
    this.currentUrl = e.url
  }

  handleNameChange = (name: string) => {
    this.setState({ name })
  }

  render ({}, { name }: AppState) {
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return (
      <div id='app'>
        <Header name={name} onNameChange={this.handleNameChange} />
        <Router onChange={this.handleRouteChange}>
          <Month signature={name} path='/' month={month} year={year} />
          <Month signature={name} path='/:year/:month' month={month} year={year} />
        </Router>
      </div>
    )
  }
}
