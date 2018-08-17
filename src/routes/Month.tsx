import { h, Component, FunctionalComponent } from 'preact'
import { format } from 'date-fns'
import style from './Month.style.css'
import { defaultMonthData } from '../calendar';

interface PeriodProps {
  readonly checked: boolean
  readonly name: string
  readonly starts: Date
  readonly ends: Date
  readonly signature?: string
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

  render ({ name, signature, starts, ends }: PeriodProps, { checked }: PeriodState) {
    return (
      <label class={style.period}>
        <input class={style.checkbox} type='checkbox' checked={checked} onClick={this.handleClick} />
        {checked && <img class={style.signature} alt={name} src={signature} />}
        <span class={style.weekday}>{format(starts, 'ddd')}</span>
        <span class={style.monthday}>{format(starts, 'D')}</span>
        <span class={style.times}>{format(starts, 'H:mm')}–{format(ends, 'H:mm')}</span>
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

  // TODO: Receive from App.
  const data = defaultMonthData(year, month)

  return (
    <div class={style.main}>
      <h1>{format(monthDate, 'MMMM YYYY')}</h1>
      {Object.entries(data)
        .map(([key, periods]) => (
          <div class={style.day} key={`day-${key}`}>
            <Period
              {...periods.am}
              name={name}
              signature={signature}
            />
            <Period
              {...periods.pm}
              name={name}
              signature={signature}
            />
          </div>
        ))
      }
    </div>
  )
}
