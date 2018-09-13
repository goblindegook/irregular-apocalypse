import { property, integer } from 'jsverify'
import { all } from 'ramda'
import { currentMonth, defaultMonthData, monthName } from './calendar'

describe('defaultMonth()', () => {
  it('returns the month number and year', () => {
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    expect(currentMonth()).toEqual({ month, year })
  })
})

describe('defaultMonthData()', () => {
  it('returns 31 daily records for August 2018', () => {
    expect(Object.keys(defaultMonthData(2018, 8))).toHaveLength(31)
  })

  it('returns 30 daily records for September 2018', () => {
    expect(Object.keys(defaultMonthData(2018, 9))).toHaveLength(30)
  })

  it('returns 28 daily records for February 2019', () => {
    expect(Object.keys(defaultMonthData(2019, 2))).toHaveLength(28)
  })

  it('returns 29 daily records for February 2020', () => {
    expect(Object.keys(defaultMonthData(2020, 2))).toHaveLength(29)
  })

  property(
    'generates first day with key 1',
    integer(2000, 2100),
    integer(1, 12),
    (year, month) => Object.keys(defaultMonthData(year, month))[0] === '1'
  )

  property('generates incremental keys', integer(2000, 2100), integer(1, 12), (year, month) => {
    const days = Object.keys(defaultMonthData(year, month)).map(v => parseInt(v, 10))
    return all(([v, i]) => v === i + 1, days.map((v, i) => [v, i]))
  })

  function getTime(date: Date): [number, number] {
    return [date.getHours(), date.getMinutes()]
  }

  property('starts the AM period at 9:00', integer(2000, 2100), integer(1, 12), (year, month) =>
    all(
      ([h, m]) => h === 9 && m === 0,
      Object.values(defaultMonthData(year, month)).map(({ am }) => getTime(am.starts))
    )
  )

  property('ends the AM period at 13:00', integer(2000, 2100), integer(1, 12), (year, month) =>
    all(
      ([h, m]) => h === 13 && m === 0,
      Object.values(defaultMonthData(year, month)).map(({ am }) => getTime(am.ends))
    )
  )

  property('starts the PM period at 14:00', integer(2000, 2100), integer(1, 12), (year, month) =>
    all(
      ([h, m]) => h === 14 && m === 0,
      Object.values(defaultMonthData(year, month)).map(({ pm }) => getTime(pm.starts))
    )
  )

  property('ends the PM period at 17:30', integer(2000, 2100), integer(1, 12), (year, month) =>
    all(
      ([h, m]) => h === 17 && m === 30,
      Object.values(defaultMonthData(year, month)).map(({ pm }) => getTime(pm.ends))
    )
  )
})

describe('monthName()', () => {
  it('returns January 2019', () => {
    expect(monthName(2018, 1)).toBe('January 2018')
  })
})
