import { getDaysInMonth, isWeekend, format, subDays, addDays } from 'date-fns'
import { gregorian } from '@pacote/computus'
import { range } from 'ramda'

export type Period = Readonly<{
  starts: Date
  ends: Date
  checked: boolean
}>

type Day = Readonly<{
  am: Period
  pm: Period
}>

export type Month = Readonly<{
  [day: string]: Day
}>

export type Periods = Readonly<{
  [yearAndMonth: string]: Month
}>

function addKeys(month: readonly Day[]): Month {
  return month.reduce<Month>((acc, day, idx) => ({ ...acc, [`${idx + 1}`]: day }), {})
}

export function buildMonth(year: number, month: number): Month {
  const daysInMonth = getDaysInMonth(new Date(year, month - 1))
  return addKeys(
    range(1, daysInMonth + 1).map(day => {
      const date = new Date(year, month - 1, day)
      return {
        am: { starts: date, ends: date, checked: false },
        pm: { starts: date, ends: date, checked: false }
      }
    })
  )
}

export function workingDays(year: number, month: number): Month {
  const daysInMonth = getDaysInMonth(new Date(year, month - 1))
  return addKeys(
    range(1, daysInMonth + 1).map(day => {
      const date = new Date(year, month - 1, day)
      const checked = !isWeekend(date)
      return {
        am: {
          starts: new Date(date.setHours(9, 0)),
          ends: new Date(date.setHours(13, 0)),
          checked
        },
        pm: {
          starts: new Date(date.setHours(14, 0)),
          ends: new Date(date.setHours(17, 30)),
          checked
        }
      }
    })
  )
}

export function holidays(year: number, month: number): Month {
  const easter = gregorian(year)
  const goodFriday = subDays(easter, 2)
  const corpusChristi = addDays(easter, 60)

  return [
    [1, 1],
    [4, 25],
    [5, 1],
    [6, 10],
    [8, 15],
    [10, 5],
    [11, 1],
    [12, 1],
    [12, 8],
    [12, 25],
    [easter.getMonth() + 1, easter.getDate()],
    [goodFriday.getMonth() + 1, goodFriday.getDate()],
    [corpusChristi.getMonth() + 1, corpusChristi.getDate()]
  ]
    .filter(([holidayMonth]) => holidayMonth === month)
    .reduce((acc, [, day]) => {
      const date = new Date(year, month - 1, day)
      return {
        ...acc,
        [date.getDate()]: {
          am: {
            starts: new Date(date.setHours(9, 0)),
            ends: new Date(date.setHours(13, 0)),
            checked: false
          },
          pm: {
            starts: new Date(date.setHours(14, 0)),
            ends: new Date(date.setHours(17, 30)),
            checked: false
          }
        }
      }
    }, {})
}

export function currentMonth(): { month: number; year: number } {
  const date = new Date()
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear()
  }
}

export function monthName(year: number, month: number): string {
  const currentDate = new Date()
  const displayYear = year || currentDate.getFullYear()
  const displayMonthIndex = month ? month - 1 : currentDate.getMonth()
  const displayDate = new Date(displayYear, displayMonthIndex)

  return format(displayDate, 'MMMM YYYY')
}
