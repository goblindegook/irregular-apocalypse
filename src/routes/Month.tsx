import { h, Component, FunctionalComponent } from 'preact'
import { format, getDaysInMonth, isWeekend } from 'date-fns'
import { range } from 'ramda'
import style from './Month.style.css'

interface PeriodProps {
  readonly checked: boolean
  readonly name: string
  readonly weekday: string
  readonly day: number
  readonly starts?: string
  readonly ends?: string
  readonly signature?: string
  readonly text: string
}

interface PeriodState {
  readonly checked: boolean
}

class Period extends Component<PeriodProps, PeriodState> {
  constructor (props: PeriodProps) {
    super(props)

    this.state = {
      checked: props.checked
    }
  }

  handleClick = (e: MouseEvent) => {
    this.setState({ checked: !this.state.checked })
  }

  render ({ name, signature, text, weekday, day }: PeriodProps, { checked }: PeriodState) {
    return (
      <label class={style.period}>
        <input class={style.checkbox} type='checkbox' checked={checked} onClick={this.handleClick} />
        {checked && <img class={style.signature} alt={name} src={signature} />}
        <span class={style.weekday}>{weekday}</span>
        <span class={style.monthday}>{day}</span>
        <span class={style.times}>{text}</span>
      </label>
    )
  }
}

interface MonthProps {
  readonly path?: string
  readonly month: number
  readonly year: number
  readonly name: string
  readonly signature?: string
}

export const Month: FunctionalComponent<MonthProps> = ({ name, signature, month, year }) => {
  const monthDate = new Date(year, month - 1)

  return (
    <div class={style.main}>
      <h1>{format(monthDate, 'MMMM YYYY')}</h1>
      {range(1, getDaysInMonth(monthDate) + 1)
        .map(day => {
          const date = new Date(year, month - 1, day)
          const checked = !isWeekend(date)
          const weekday = format(date, 'ddd')
          return (
            <div class={style.day} key={`day-${day}`}>
              <Period
                checked={checked}
                day={day}
                name={name}
                signature={signature}
                text='9:00–13:00'
                weekday={weekday}
              />
              <Period
                checked={checked}
                day={day}
                name={name}
                signature={signature}
                text='14:00–17:30'
                weekday={weekday}
              />
            </div>
          )
        })
      }
    </div>
  )
}
