import { h, Component } from 'preact'
import { format, getDaysInMonth, isWeekend } from 'date-fns'
import { range } from 'ramda'
import style from './Month.style.css'

interface PeriodProps {
  readonly defaultChecked: boolean
  readonly signature: string
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

  render ({ signature, text }: PeriodProps, { checked }: PeriodState) {
    return (
      <label class={style.period}>
        <input class={style.checkbox} type='checkbox' checked={checked} onClick={this.handleClick} />
        {checked && <span class={style.signature}>{signature}</span>}
        <span class={style.periodName}>{text}</span>
      </label>
    )
  }
}

interface MonthProps {
  readonly path?: string
  readonly month: number
  readonly year: number
  readonly signature: string
}

interface MonthState {}

export class Month extends Component<MonthProps, MonthState> {
  render ({ signature, month, year }: MonthProps) {
    const monthDate = new Date(year, month - 1)

    return (
      <div class={style.main}>
        <h1>{format(monthDate, 'MMMM YYYY')}</h1>
        {range(1, getDaysInMonth(monthDate) + 1)
          .map(day => {
            const checked = !isWeekend(new Date(year, month - 1, day))
            return (
              <div class={style.day} key={`day-${day}`}>
                <Period signature={signature} text={`Day ${day} (morning)`} defaultChecked={checked} />
                <Period signature={signature} text={`Day ${day} (afternoon)`} defaultChecked={checked} />
              </div>
            )
          })
        }
      </div>
    )
  }
}
