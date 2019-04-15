import { getDaysInMonth, isWeekend, format } from 'date-fns'
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

function monthData(year: number, month: number): Day[] {
  const daysInMonth = getDaysInMonth(new Date(year, month - 1))

  return range(1, daysInMonth + 1).map(day => {
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
}

function addKeys(month: readonly Day[]): Month {
  return month.reduce<Month>((acc, day, idx) => ({ ...acc, [`${idx + 1}`]: day }), {})
}

export function defaultMonthData(year: number, month: number): Month {
  return addKeys(monthData(year, month))
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
