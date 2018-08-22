import { h, Component } from 'preact'
import styled from 'preact-emotion'
import { format } from 'date-fns'
import { mergeDeepRight } from 'ramda'
import { defaultMonthData, Period, Periods } from '../calendar'
import { withProps } from './HOC'

interface PeriodProps {
  readonly checked: boolean
  readonly name: string
  readonly starts: Date
  readonly ends: Date
  readonly signature?: string
  readonly onChange: (period: Period) => Promise<void>
}

const PeriodWrapper = styled('label')`
  display: grid;
  grid-template-rows: 4rem 1rem;
  grid-template-columns: 1rem 4rem auto;
  padding: 1rem;
  border: 1px solid #eee;

  @media print {
    grid-template-rows: 1rem;
    grid-template-columns: 2rem 4rem 6rem auto;
    padding: .25rem;
  }
`

const Checkbox = withProps({
  type: 'checkbox'
})(styled('input')`
  align-self: center;
  grid-row: 1;
  grid-column: 1 / span 2;

  @media print {
    display: none;
  }
`)

const MonthDay = styled('span')`
  grid-column: 2;
  grid-row: 1;
  align-self: center;
  justify-self: center;
  font-size: 2rem;

  @media print {
    font-size: 1.25rem;
    grid-column: 1;
    grid-row: 1;
    justify-self: right;
  }
`

const WeekDay = styled('span')`
  font-size: .8rem;
  align-self: center;
  justify-self: center;
  grid-column: 2;
  grid-row: 2;

  @media print {
    font-size: .6rem;
    grid-column: 2;
    grid-row: 1;
  }
`

const Signature = styled('img')`
  grid-row: 1;
  grid-column: 3;
  align-self: center;
  height: 4rem;

  @media print {
    height: 1.5rem;
    grid-column: 4;
    grid-row: 1;
  }
`

const Times = styled('span')`
  font-size: .8rem;
  grid-row: 2;
  grid-column: 3;

  @media print {
    font-size: .6rem;
    grid-column: 3;
    grid-row: 1;
    align-self: center;
    justify-self: center;
    padding: 1rem;
  }
`

class DayPeriod extends Component<PeriodProps> {

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
      <PeriodWrapper>
        <Checkbox checked={checked} onClick={this.handleClick} />
        <MonthDay>{format(starts, 'D')}</MonthDay>
        <WeekDay>{format(starts, 'ddd')}</WeekDay>
        {checked && <Signature alt={name} src={signature} />}
        <Times>{format(starts, 'H:mm')}–{format(ends, 'H:mm')}</Times>
      </PeriodWrapper>
    )
  }
}

interface MonthProps {
  readonly month: number
  readonly year: number
  readonly periods?: RecursivePartial<Periods>
  readonly name: string
  readonly signature: string
  readonly onPeriodChange: (period: Period) => Promise<void>
}

const Main = styled('main')`
  margin-top: 56px;
  padding: 15px;

  @media print {
    margin-top: 0;
  }
`

const Day = styled('div')`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto;
`

export const Month = ({ periods = {}, name, signature, month, year, onPeriodChange }: MonthProps) => {
  const currentDate = new Date()
  const displayYear = year || currentDate.getFullYear()
  const displayMonthIndex = month - 1 || currentDate.getMonth()
  const displayDate = new Date(displayYear, displayMonthIndex)
  const periodKey = format(displayDate, `YYYY-MM`)
  const periodData = mergeDeepRight(defaultMonthData(displayYear, displayMonthIndex + 1), periods[periodKey] || {})

  return (
    <Main>
      {Object.entries(periodData)
        .map(([key, day]) => (
          <Day key={`day-${key}`}>
            <DayPeriod {...day.am} name={name} signature={signature} onChange={onPeriodChange} />
            <DayPeriod {...day.pm} name={name} signature={signature} onChange={onPeriodChange} />
          </Day>
        ))
      }
    </Main>
  )
}
