import { h, Component } from 'preact'
import { Router, RouterOnChangeArgs } from 'preact-router'
import * as localforage from 'localforage'
import { mergeDeepRight } from 'ramda'
import { format } from 'date-fns'
import { Period, Periods, currentMonth, monthName } from '../calendar'
import { Header } from './Header'
import { Footer } from './Footer'
import { Month } from './Month'
import { Route } from './HOC'

const Helmet = require('preact-helmet')

interface AppState {
  name: string
  signature: string
  periods: Periods
}

function title (...fragments: string[]): string {
  return fragments.filter(c => c.length).join(' - ')
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
    const periods = await this.store.getItem('periods') || {}
    this.setState(() => ({ name, periods, signature }))
  }

  render ({}, { name, periods, signature }: AppState) {
    const current = currentMonth()

    return (
      <Router onChange={this.handleRouteChange}>
        <Route path='/:yyyy?/:mm?'>
          {[({ yyyy, mm }) => {
            const year = parseInt(yyyy, 10) || current.year
            const month = parseInt(mm, 10) || current.month
            const periodKey = format(new Date(year, month - 1), `YYYY-MM`)
            const data = periods[periodKey]
            
            return (
              <div>
                <Helmet title={title(monthName(year, month), name)} />
                <Header
                  name={name}
                  month={month}
                  year={year}
                  onNameChange={this.handleNameChange}
                  onSignatureChange={this.handleSignatureChange}
                />
                <Month
                  name={name}
                  signature={signature}
                  month={month}
                  year={year}
                  data={data}
                  onPeriodChange={this.handlePeriodChange}
                />
                <Footer />
              </div>
            )
          }]}
        </Route>
      </Router>
    )
  }
}
