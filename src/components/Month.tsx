import { h } from 'preact'
import styled from 'preact-emotion'
import { format } from 'date-fns'
import { mergeDeepRight } from 'ramda'
import { defaultMonthData, Period, Month as MonthData } from '../calendar'
import { withProps } from './HOC'

interface PeriodProps {
  readonly checked: boolean
  readonly name: string
  readonly id: string
  readonly starts: Date
  readonly ends: Date
  readonly signature?: string
  readonly onChange: (period: Period) => Promise<void>
}

const PeriodWrapper = styled('div')`
  display: grid;
  grid-template-rows: 4rem 1rem;
  grid-template-columns: 1rem 4rem 1fr;
  padding: 1rem;
  border: 1px solid #eee;

  @media print {
    grid-template-rows: 1rem;
    grid-template-columns: 2rem 3rem auto 1fr;
    padding: .2rem;
    border-left: 0;
    border-right: 0;
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

const MonthDay = styled('label')`
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

const WeekDay = styled('label')`
  font-size: .8rem;
  grid-column: 2;
  grid-row: 2;
  text-align: center;

  @media print {
    font-size: .6rem;
    grid-column: 2;
    grid-row: 1;
  }
`

const DottedLine = styled('label')`
  grid-row: 1;
  grid-column: 3;
  align-self: center;
  height: 4rem;
  width: 100%;

  @media print {
    height: 1.5rem;
    grid-column: 4;
    grid-row: 1;
  }
`

const Signature = styled('img')`
  height: 100%;
  max-width: 100%;
  width: auto;
`

const Times = styled('div')`
  font-size: .85rem;
  grid-row: 2;
  grid-column: 3;

  @media print {
    grid-column: 3;
    grid-row: 1;
  }
`

const Time = withProps({
  type: 'time'
})(styled('input')`
  margin: 0 .5rem;
  max-width: 5rem;
  text-align: center;

  ::-ms-clear,
  ::-webkit-clear-button {
    display: none;
  }

  @media print {
    -moz-appearance: textfield;
    border: 0;
    margin: 0 0 0 .5rem;
    background-color: transparent;

    ::-webkit-inner-spin-button {
      display: none;
    }
  }
`)

function preventDefault (e: Event): void {
  e.preventDefault()
}

function handleTimeChange ({ starts, ends, checked, onChange }: PeriodProps): (e: Event) => Promise<void> {
  return async e => {
    const name = (e.target as any).name as string
    const value = (e.target as any).value as string || ''
    const matches = value.match(/(\d+)(\:(\d+))?/i)

    if (matches) {
      (name === 'starts' ? starts : ends).setHours(
        parseInt(matches[1], 10) || 0,
        parseInt(matches[3], 10) || 0
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
    <Checkbox id={props.id} checked={props.checked} onClick={handleClick(props)} />
    <MonthDay for={props.id}>{format(props.starts, 'D')}</MonthDay>
    <WeekDay for={props.id}>{format(props.starts, 'ddd')}</WeekDay>
    <DottedLine for={props.id}>
      {props.checked ? <Signature alt={props.name} src={props.signature} /> : ''}
    </DottedLine>
    {props.checked &&
      <Times>
        <Time
          name='starts'
          placeholder='Start time'
          value={format(props.starts, 'HH:mm')}
          onChange={handleTimeChange(props)}
        />
        —
        <Time
          name='ends'
          placeholder='End time'
          value={format(props.ends, 'HH:mm')}
          onChange={handleTimeChange(props)}
        />
      </Times>
    }
  </PeriodWrapper>
)

interface MonthProps {
  readonly month: number
  readonly year: number
  readonly data?: MonthData;
  readonly name: string
  readonly signature: string
  readonly onPeriodChange: (period: Period) => Promise<void>
}

const Main = styled('ol')`
  margin-top: 56px;
  padding: 15px;

  @media print {
    margin-top: 0;
  }
`

const Day = styled('li')`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: auto;
`

export const Month = ({ data = {}, name, signature, month, year, onPeriodChange }: MonthProps) => {
  const monthData = mergeDeepRight(defaultMonthData(year, month), data)

  return (
    <Main>
      {Object.entries(monthData)
        .map(([key, day]) => (
          <Day key={`day-${key}`}>
            <DayPeriod {...day.am} id={`day-${key}-am`} name={name} signature={signature} onChange={onPeriodChange} />
            <DayPeriod {...day.pm} id={`day-${key}-pm`} name={name} signature={signature} onChange={onPeriodChange} />
          </Day>
        ))
      }
    </Main>
  )
}
