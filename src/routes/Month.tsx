import { h, Component } from 'preact'
import { format, getDaysInMonth } from 'date-fns'
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
      <label>
        <input type='checkbox' checked={checked} onClick={this.handleClick} />
        {checked && <span>{signature}</span>}
        {text}
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
    const date = new Date(year, month - 1)

    return (
      <div class={style.main}>
        <h1>{format(date, 'MMMM YYYY')}</h1>
        {range(1, getDaysInMonth(date) + 1)
          .map(day => (
            <div key={`day-${day}`}>
              <Period signature={signature} text={`Day ${day} (morning)`} defaultChecked={true} />
              <Period signature={signature} text={`Day ${day} (afternoon)`} defaultChecked={true} />
            </div>
          ))
        }
      </div>
    )
  }
}
