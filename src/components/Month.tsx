import { createElement } from 'preact'
import { format } from 'date-fns'
import { mergeDeepLeft } from 'ramda'
import { Period, Month as MonthData, buildMonth } from '../calendar'

type PeriodProps = Readonly<{
  checked: boolean
  name: string
  id: string
  starts: Date
  ends: Date
  signature?: string
  onChange: (period: Period) => void
}>

function setTime(date: Date, hours: number, minutes: number): Date {
  const newDate = new Date(date)
  newDate.setHours(hours, minutes)
  return newDate
}

function handleTimeChange({ starts, ends, checked, onChange }: PeriodProps): (e: Event) => void {
  return e => {
    if (e.target) {
      const target = e.target as HTMLInputElement
      const matches = target.value.match(/(\d+):?(\d+)?/i)

      if (matches) {
        const hours = parseInt(matches[1], 10) || 0
        const minutes = parseInt(matches[2], 10) || 0

        onChange({
          starts: target.name === 'starts' ? setTime(starts, hours, minutes) : starts,
          ends: target.name === 'ends' ? setTime(ends, hours, minutes) : ends,
          checked
        })
      }
    }
  }
}

function handleClick({ starts, ends, checked, onChange }: PeriodProps): (e: MouseEvent) => void {
  return () => {
    onChange({ starts, ends, checked: !checked })
  }
}

const DayPeriod = (props: PeriodProps) => (
  <div class="c-Month-PeriodWrapper">
    <input
      class="c-Month-Checkbox"
      id={props.id}
      type="checkbox"
      checked={props.checked}
      onClick={handleClick(props)}
    />

    <label class="c-Month-MonthDay" for={props.id}>
      {format(props.starts, 'D')}
    </label>

    <label class="c-Month-WeekDay" for={props.id}>
      {format(props.starts, 'ddd')}
    </label>

    <label class="c-Month-DottedLine" for={props.id}>
      {props.checked && <img class="c-Month-Signature" alt={props.name} src={props.signature} />}
    </label>

    {props.checked && (
      <div class="c-Month-Times">
        <input
          class="c-Month-TimeInput"
          type="time"
          name="starts"
          placeholder="Start time"
          value={format(props.starts, 'HH:mm')}
          onChange={handleTimeChange(props)}
        />
        —
        <input
          class="c-Month-TimeInput"
          type="time"
          name="ends"
          placeholder="End time"
          value={format(props.ends, 'HH:mm')}
          onChange={handleTimeChange(props)}
        />
      </div>
    )}
  </div>
)

export type MonthProps = Readonly<{
  month: number
  year: number
  data?: MonthData
  name?: string
  signature?: string
  onChange: (period: Period) => void
}>

export const Month = ({
  data = {},
  name = '',
  signature = '',
  month,
  year,
  onChange
}: MonthProps) => {
  const monthData: MonthData = mergeDeepLeft(data, buildMonth(year, month))

  return (
    <main>
      <ol class="c-Month-Month">
        {Object.entries(monthData).map(([key, day]) => (
          <li class="c-Month-Day" key={`day-${key}`}>
            <DayPeriod
              {...day.am}
              id={`day-${key}-am`}
              name={name}
              signature={signature}
              onChange={onChange}
            />
            <DayPeriod
              {...day.pm}
              id={`day-${key}-pm`}
              name={name}
              signature={signature}
              onChange={onChange}
            />
          </li>
        ))}
      </ol>
    </main>
  )
}
