import { h, Component } from 'preact'
import styled from 'preact-emotion'
import { format, getTime } from 'date-fns'
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
    grid-template-columns: 2rem 4rem 9rem auto;
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
  }
`

const Time = withProps({
  type: 'text'
})(styled('input')`
  font-size: .8rem;
  width: 3rem;
  text-align: right;
  margin: 0 .5rem;

  @media print {
    border: 0;
    text-align: center;
    background-color: transparent;
  }
`)

function preventDefault (e: Event): void {
  e.preventDefault()
}

function handleTimeChange ({ starts, ends, checked, onChange }: PeriodProps): (e: Event) => Promise<void> {
  return async e => {
    const name = (e.target as any).name as string
    const value = (e.target as any).value as string || ''
    const matches = value.match(/(\d+)[:\.]?(\d+)?(am|pm)?/i)

    if (matches) {
      (name === 'starts' ? starts : ends).setHours(
        parseInt(matches[1], 10) + (/pm/.test(matches[3] || '') ? 12 : 0),
        parseInt(matches[2], 10) || 0
      )

      await onChange({ starts, ends, checked })
    }
  }
}

function handleClick ({ starts, ends, checked, onChange }: PeriodProps): (e: MouseEvent) => Promise<void> {
  return async e => {
    await onChange({ starts, ends, checked: !checked })
  }
}

const DayPeriod = (props: PeriodProps) => (
  <PeriodWrapper>
    <Checkbox checked={props.checked} onClick={handleClick(props)} />
    <MonthDay>{format(props.starts, 'D')}</MonthDay>
    <WeekDay>{format(props.starts, 'ddd')}</WeekDay>
    {props.checked && <Signature alt={props.name} src={props.signature} />}
    {props.checked &&
      <Times>
        <Time
          name='starts'
          placeholder='Start time'
          value={format(props.starts, 'H:mm')}
          onChange={handleTimeChange(props)}
          onClick={preventDefault}
        />
        –
        <Time
          name='ends'
          placeholder='End time'
          value={format(props.ends, 'H:mm')}
          onChange={handleTimeChange(props)}
          onClick={preventDefault}
        />
      </Times>
    }
  </PeriodWrapper>
)

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
