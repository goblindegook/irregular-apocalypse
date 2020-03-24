/* eslint-disable @typescript-eslint/no-var-requires */

import { createElement } from 'preact'
import { Router } from 'preact-router'
import localforage from 'localforage'
import { mergeDeepRight } from 'ramda'
import { format } from 'date-fns'
import { Periods, currentMonth, monthName, workingDays, holidays } from '../calendar'
import { Header } from './Header'
import { Footer } from './Footer'
import { Month } from './Month'
import { Route } from '../Route'
import { useStateStore } from '../hooks'

const Helmet = require('preact-helmet')
const defaultSignature = require('../assets/signature.svg')

function formatPeriodKey(date: Date): string {
  return format(date, `yyyy-MM`)
}

const Main = ({ store, month, year }: { store: LocalForage; month: number; year: number }) => {
  const [name, setName, storeError] = useStateStore(store, 'name', '')
  const [signature, setSignature] = useStateStore<string>(store, 'signature', defaultSignature)
  const [periods, setPeriods] = useStateStore<Periods>(store, 'periods', {})

  const periodKey = formatPeriodKey(new Date(year, month - 1))
  const monthData = mergeDeepRight<any, any>(
    mergeDeepRight(workingDays(year, month), holidays(year, month)),
    periods[periodKey] || {}
  )

  if (storeError) {
    console.error('Error with LocalStorage', storeError)
  }

  return (
    <div>
      <Helmet title={[monthName(year, month), name].filter((c) => c.length).join(' - ')} />
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
        data={monthData}
        onChange={(period) => {
          const update = {
            [formatPeriodKey(period.starts)]: {
              [format(period.starts, 'd')]: {
                [format(period.starts, 'a').toLowerCase()]: period,
              },
            },
          }

          setPeriods(mergeDeepRight<any, any>(periods, update))
        }}
      />
      <Footer />
    </div>
  )
}

export const App = () => {
  const current = currentMonth()

  const store = localforage.createInstance({
    name: 'irregular-apocalypse',
    version: 1.0,
    storeName: 'timesheets',
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
