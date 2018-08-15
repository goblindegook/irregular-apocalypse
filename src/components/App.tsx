import { h, Component } from 'preact'
import { Router, RouterOnChangeArgs } from 'preact-router'
import { Header } from './Header'
import { Month } from '../routes/Month'

interface AppState {
  name: string
  signature?: string
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

  handleSignatureChange = (signature: string) => {
    this.setState({ signature })
  }

  render ({}, { name, signature }: AppState) {
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return (
      <div id='app'>
        <Header name={name} onNameChange={this.handleNameChange} onSignatureChange={this.handleSignatureChange} />
        <Router onChange={this.handleRouteChange}>
          <Month name={name} signature={signature} path='/' month={month} year={year} />
          <Month name={name} signature={signature} path='/:year/:month' month={month} year={year} />
        </Router>
      </div>
    )
  }
}
