import { h, Component, FunctionalComponent } from 'preact'
import { format } from 'date-fns'
import style from './Month.style.css'
import { mergeDeepRight } from 'ramda'
import { defaultMonthData, Period, Periods } from '../calendar'

interface PeriodProps {
  readonly checked: boolean
  readonly name: string
  readonly starts: Date
  readonly ends: Date
  readonly signature?: string
  readonly onChange: (period: Period) => Promise<void>
}

class PeriodComponent extends Component<PeriodProps> {

  handleClick = async (e: MouseEvent) => {
    await this.props.onChange({
      starts: this.props.starts,
      ends: this.props.ends,
      checked: !this.props.checked
    })
  }

  render ({ name, signature, starts, ends, checked, onChange }: PeriodProps) {
    // FIXME: Only display times for checked periods.
    return (
      <label class={style.period}>
        <input class={style.checkbox} type='checkbox' checked={checked} onClick={this.handleClick} />
        <span class={style.monthday}>{format(starts, 'D')}</span>
        <span class={style.weekday}>{format(starts, 'ddd')}</span>
        {checked && <img class={style.signature} alt={name} src={signature} />}
        <span class={style.times}>{format(starts, 'H:mm')}–{format(ends, 'H:mm')}</span>
      </label>
    )
  }
}

interface MonthProps {
  readonly path?: string
  readonly month: number
  readonly year: number
  readonly periods: Periods
  readonly name: string
  readonly signature?: string
  readonly onPeriodChange: (period: Period) => Promise<void>
}

export const Month: FunctionalComponent<MonthProps> = ({ periods, name, signature, month, year, onPeriodChange }) => {
  const monthDate = new Date(year, month - 1)
  const key = format(monthDate, `YYYY-MM`)
  const periodData = mergeDeepRight(defaultMonthData(year, month), periods[key] || {})

  return (
    <div class={style.main}>
      <h1>{format(monthDate, 'MMMM YYYY')}</h1>
      {Object.entries(periodData)
        .map(([key, day]) => (
          <div class={style.day} key={`day-${key}`}>
            <PeriodComponent
              {...day.am}
              name={name}
              signature={signature}
              onChange={onPeriodChange}
            />
            <PeriodComponent
              {...day.pm}
              name={name}
              signature={signature}
              onChange={onPeriodChange}
            />
          </div>
        ))
      }
    </div>
  )
}
