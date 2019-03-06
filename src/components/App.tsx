/* tslint:disable:jsx-no-lambda */

import { h, Component } from 'preact'
import { Router, RouterOnChangeArgs } from 'preact-router'
import * as localforage from 'localforage'
import { mergeDeepRight } from 'ramda'
import { format } from 'date-fns'
import { Period, Periods, currentMonth, monthName } from '../calendar'
import { Header } from './Header'
import { Footer } from './Footer'
import { Month } from './Month'
import { Route } from '../HOC'

const Helmet = require('preact-helmet')
const defaultSignature = require('../assets/signature.svg')

interface AppState {
  name: string
  signature: string
  periods: Periods
}

export class App extends Component<{}, AppState> {
  state = {
    name: '',
    periods: {},
    signature: ''
  }

  store = localforage.createInstance({
    name: 'irregular-apocalypse',
    version: 1.0,
    storeName: 'timesheets'
  })

  handleNameChange = async (name: string) => {
    this.setState({ name })
    await this.store.setItem('name', name)
  }

  handleSignatureChange = async (signature: string) => {
    this.setState({ signature })
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

    this.setState(({ periods }: Partial<AppState>) => ({
      periods: mergeDeepRight(periods, update)
    }))

    await this.store.setItem('periods', mergeDeepRight(this.state.periods, update))
  }

  async componentDidMount() {
    const name = (await this.store.getItem('name')) || ''
    const signature = (await this.store.getItem('signature')) || defaultSignature
    const periods = (await this.store.getItem('periods')) || {}
    this.setState(() => ({ name, periods, signature }))
  }

  render({}, { name, periods, signature }: AppState) {
    const current = currentMonth()

    return (
      <Router>
        <Route
          path="/:yyyy?/:mm?"
          render={({ yyyy, mm }) => {
            const year = parseInt(yyyy, 10) || current.year
            const month = parseInt(mm, 10) || current.month
            const periodKey = format(new Date(year, month - 1), `YYYY-MM`)

            return (
              <div>
                <Helmet title={[monthName(year, month), name].filter(c => c.length).join(' - ')} />
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
                  data={periods[periodKey]}
                  onPeriodChange={this.handlePeriodChange}
                />
                <Footer />
              </div>
            )
          }}
        />
      </Router>
    )
  }
}
