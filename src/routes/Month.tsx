import { h, Component } from 'preact'
import { format, getDaysInMonth } from 'date-fns'
import { range } from 'ramda'
import style from './Month.style.css'

interface MonthProps {
  readonly path?: string
  readonly month: number
  readonly year: number
}

interface MonthState {}

export class Month extends Component<MonthProps, MonthState> {
  render ({ month, year }: MonthProps) {
    const date = new Date(year, month - 1)
    return (
      <div class={style.main}>
        <h1>{format(date, 'MMMM YYYY')}</h1>
        {range(1, getDaysInMonth(date) + 1)
          .map(day => (
            <div key={`day-${day}`}>
              <label>
                <input type='checkbox' checked={true} /> Day {day} (morning)
              </label>
              <label>
                <input type='checkbox' checked={true} /> Day {day} (afternoon)
              </label>
            </div>
          ))
        }
      </div>
    )
  }
}
