import { h, Component } from 'preact'
import { Router, RouterOnChangeArgs } from 'preact-router'
import * as localforage from 'localforage'
import { Header } from './Header'
import { Month } from '../routes/Month'

interface AppState {
  name: string
  signature?: string
}

export class App extends Component<{}, AppState> {
  currentUrl = ''

  store: LocalForage

  constructor () {
    super()

    this.state = {
      name: ''
    }

    this.store = localforage.createInstance({
      name: 'irregularApocalypse',
      version: 1.0,
      storeName: 'timesheets'
    })
  }

  handleRouteChange = (e: RouterOnChangeArgs) => {
    this.currentUrl = e.url
  }

  handleNameChange = async (name: string) => {
    this.setState(() => ({ name }))
    await this.store.setItem('name', name)
  }

  handleSignatureChange = async (signature: string) => {
    this.setState(() => ({ signature }))
    await this.store.setItem('signature', signature)
  }

  async componentDidMount () {
    const name = await this.store.getItem('name') || ''
    const signature = await this.store.getItem('signature') || ''
    this.setState(() => ({ name, signature }))
  }

  render ({}, { name, signature }: AppState) {
    const defaultDate = new Date()
    const defaultMonth = defaultDate.getMonth() + 1
    const defaultYear = defaultDate.getFullYear()

    return (
      <div id='app'>
        <Header
          name={name}
          onNameChange={this.handleNameChange}
          onSignatureChange={this.handleSignatureChange}
        />
        <Router onChange={this.handleRouteChange}>
          <Month
            name={name}
            signature={signature}
            path='/'
            month={defaultMonth}
            year={defaultYear}
          />
          <Month
            name={name}
            signature={signature}
            path='/:year/:month'
            month={defaultMonth}
            year={defaultYear}
          />
        </Router>
      </div>
    )
  }
}
