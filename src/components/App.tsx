import { h, Component } from 'preact'
import { Router, RouterOnChangeArgs } from 'preact-router'
import * as localforage from 'localforage'
import { mergeDeepRight } from 'ramda'
import { format } from 'date-fns'
import { Header } from './Header'
import { Month } from './Month'
import { Period, Periods } from '../calendar'
import { Route } from './HOC'

interface AppState {
  name: string
  signature: string
  periods: Periods
}

export class App extends Component<{}, AppState> {
  currentUrl = ''

  store: LocalForage

  constructor () {
    super()

    this.state = {
      name: '',
      periods: {},
      signature: ''
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

  handlePeriodChange = async (period: Period) => {
    const update = {
      [format(period.starts, 'YYYY-MM')]: {
        [format(period.starts, 'D')]: {
          [format(period.starts, 'a')]: period
        }
      }
    }

    this.setState(({ periods }: Partial<AppState>) => ({ periods: mergeDeepRight(periods, update) }))

    await this.store.setItem('periods', mergeDeepRight(this.state.periods, update))
  }

  async componentDidMount () {
    const name = await this.store.getItem('name') || ''
    const signature = await this.store.getItem('signature') || ''
    const periods = await this.store.getItem('periods') || ''
    this.setState(() => ({ name, periods, signature }))
  }

  render ({}, { name, signature }: AppState) {
    return (
      <Router onChange={this.handleRouteChange}>
        <Route path='/:year?/:month?'>
          {[({ month, year }) => (
            <div>
              <Header
                name={name}
                onNameChange={this.handleNameChange}
                onSignatureChange={this.handleSignatureChange}
              />
              <Month
                month={parseInt(month, 10)}
                year={parseInt(year, 10)}
                name={name}
                periods={this.state.periods}
                signature={signature}
                onPeriodChange={this.handlePeriodChange}
              />
            </div>
          )]}
        </Route>
      </Router>
    )
  }
}
