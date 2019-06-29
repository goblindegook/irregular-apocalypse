import { h, Fragment } from 'preact'
import { Router } from 'preact-router'
import localforage from 'localforage'
import { mergeDeepRight } from 'ramda'
import { format } from 'date-fns'
import { Periods, currentMonth, monthName } from '../calendar'
import { Header } from './Header'
import { Footer } from './Footer'
import { Month } from './Month'
import { Route } from '../Route'
import { useStateStore } from '../hooks'

const Helmet = require('preact-helmet')
const defaultSignature = require('../assets/signature.svg')

const Main = ({ store, month, year }: { store: LocalForage; month: number; year: number }) => {
  const [name, setName] = useStateStore(store, 'name', '')
  const [signature, setSignature] = useStateStore(store, 'signature', defaultSignature)
  const [periods, setPeriods] = useStateStore<Periods>(store, 'periods', {})

  const periodKey = format(new Date(year, month - 1), `YYYY-MM`)

  return (
    <Fragment>
      <Helmet title={[monthName(year, month), name].filter(c => c.length).join(' - ')} />
      <Header
        name={name}
        month={month}
        year={year}
        onNameChange={setName}
        onSignatureChange={setSignature}
      />
      <Month
        name={name}
        signature={signature}
        month={month}
        year={year}
        data={periods[periodKey]}
        onPeriodChange={period => {
          const update = {
            [format(period.starts, 'YYYY-MM')]: {
              [format(period.starts, 'D')]: {
                [format(period.starts, 'a')]: period
              }
            }
          }

          setPeriods(mergeDeepRight(periods, update))
        }}
      />
      <Footer />
    </Fragment>
  )
}

export const App = () => {
  const current = currentMonth()

  const store = localforage.createInstance({
    name: 'irregular-apocalypse',
    version: 1.0,
    storeName: 'timesheets'
  })

  return (
    <Router>
      <Route
        path="/:yyyy?/:mm?"
        render={({ yyyy, mm }) => {
          const year = parseInt(yyyy, 10) || current.year
          const month = parseInt(mm, 10) || current.month

          return <Main store={store} month={month} year={year} />
        }}
      />
    </Router>
  )
}
