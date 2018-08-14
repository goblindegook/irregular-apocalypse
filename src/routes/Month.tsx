import { h, Component } from 'preact'
import { format, getDaysInMonth, isWeekend } from 'date-fns'
import { range } from 'ramda'
import style from './Month.style.css'

interface PeriodProps {
  readonly defaultChecked: boolean
  readonly name: string
  readonly text: string
}

interface PeriodState {
  readonly checked: boolean
}

class Period extends Component<PeriodProps, PeriodState> {
  constructor (props: PeriodProps) {
    super(props)

    this.state = {
      checked: props.defaultChecked
    }
  }

  handleClick = (e: MouseEvent) => {
    this.setState({ checked: !this.state.checked })
  }

  render ({ name, text }: PeriodProps, { checked }: PeriodState) {
    return (
      <label class={style.period}>
        <input class={style.checkbox} type='checkbox' checked={checked} onClick={this.handleClick} />
        {checked && <span class={style.signature}>{name}</span>}
        <span class={style.periodName}>{text}</span>
      </label>
    )
  }
}

interface MonthProps {
  readonly path?: string
  readonly month: number
  readonly year: number
  readonly name: string
}

interface MonthState {}

export class Month extends Component<MonthProps, MonthState> {
  render ({ name, month, year }: MonthProps) {
    const monthDate = new Date(year, month - 1)

    return (
      <div class={style.main}>
        <h1>{format(monthDate, 'MMMM YYYY')}</h1>
        {range(1, getDaysInMonth(monthDate) + 1)
          .map(day => {
            const date = new Date(year, month - 1, day)
            const checked = !isWeekend(date)
            const weekday = format(date, 'dddd')
            return (
              <div class={style.day} key={`day-${day}`}>
                <Period name={name} text={`${weekday} ${day} (morning)`} defaultChecked={checked} />
                <Period name={name} text={`${weekday} ${day} (afternoon)`} defaultChecked={checked} />
              </div>
            )
          })
        }
      </div>
    )
  }
}
