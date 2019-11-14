import { assert, property, integer } from 'fast-check'
import { all } from 'ramda'
import { currentMonth, workingDays, monthName, holidays } from './calendar'

describe('currentMonth()', () => {
  it('returns the month number and year', () => {
    const month = new Date().getMonth() + 1
    const year = new Date().getFullYear()
    expect(currentMonth()).toEqual({ month, year })
  })
})

describe('monthName()', () => {
  it('returns January 2019', () => {
    expect(monthName(2018, 1)).toBe('January 2018')
  })
})

describe('workingDays()', () => {
  it('returns 31 daily records for August 2018', () => {
    expect(Object.keys(workingDays(2018, 8))).toHaveLength(31)
  })

  it('returns 30 daily records for September 2018', () => {
    expect(Object.keys(workingDays(2018, 9))).toHaveLength(30)
  })

  it('returns 28 daily records for February 2019', () => {
    expect(Object.keys(workingDays(2019, 2))).toHaveLength(28)
  })

  it('returns 29 daily records for February 2020', () => {
    expect(Object.keys(workingDays(2020, 2))).toHaveLength(29)
  })

  it('generates first day with key 1', () => {
    assert(
      property(
        integer(2000, 2100),
        integer(1, 12),
        (year, month) => Object.keys(workingDays(year, month))[0] === '1'
      )
    )
  })

  it('generates incremental keys', () => {
    assert(
      property(integer(2000, 2100), integer(1, 12), (year, month) => {
        const days = Object.keys(workingDays(year, month)).map(v => parseInt(v, 10))
        return all(
          ([v, i]) => v === i + 1,
          days.map((v, i) => [v, i])
        )
      })
    )
  })

  function getTime(date: Date): [number, number] {
    return [date.getHours(), date.getMinutes()]
  }

  it('starts the AM period at 9:00', () => {
    assert(
      property(integer(2000, 2100), integer(1, 12), (year, month) =>
        all(
          ([h, m]) => h === 9 && m === 0,
          Object.values(workingDays(year, month)).map(({ am }) => getTime(am.starts))
        )
      )
    )
  })

  it('ends the AM period at 13:00', () => {
    assert(
      property(integer(2000, 2100), integer(1, 12), (year, month) =>
        all(
          ([h, m]) => h === 13 && m === 0,
          Object.values(workingDays(year, month)).map(({ am }) => getTime(am.ends))
        )
      )
    )
  })

  it('starts the PM period at 14:00', () => {
    assert(
      property(integer(2000, 2100), integer(1, 12), (year, month) =>
        all(
          ([h, m]) => h === 14 && m === 0,
          Object.values(workingDays(year, month)).map(({ pm }) => getTime(pm.starts))
        )
      )
    )
  })

  it('ends the PM period at 17:30', () => {
    assert(
      property(integer(2018, 2100), integer(1, 12), (year, month) =>
        all(
          ([h, m]) => h === 17 && m === 30,
          Object.values(workingDays(year, month)).map(({ pm }) => getTime(pm.ends))
        )
      )
    )
  })
})

describe('Portuguese holidays()', () => {
  test.each<[number, number]>([
    [1, 1],
    [4, 25],
    [5, 1],
    [6, 10],
    [8, 15],
    [10, 5],
    [11, 1],
    [12, 1],
    [12, 8],
    [12, 25]
  ])('%d/%d', (month, day) => {
    assert(
      property(integer(2018, 2028), year => {
        const data = holidays(year, month)
        return !data[day].am.checked && !data[day].pm.checked
      })
    )
  })

  it('Easter', () => {
    const april2019 = holidays(2019, 4)
    expect(april2019[21].am.checked).toBe(false)
    expect(april2019[21].pm.checked).toBe(false)
  })

  it('Good Friday (2 days before Easter)', () => {
    const april2019 = holidays(2019, 4)
    expect(april2019[19].am.checked).toBe(false)
    expect(april2019[19].pm.checked).toBe(false)
  })

  it('Corpus Christi (60 days after Easter)', () => {
    const june2019 = holidays(2019, 6)
    expect(june2019[20].am.checked).toBe(false)
    expect(june2019[20].pm.checked).toBe(false)
  })
})
