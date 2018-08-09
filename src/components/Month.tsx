import { h, Component } from 'preact'
import { format } from 'date-fns'

interface MonthProps {
  readonly path?: string
  readonly month: number
  readonly year: number
}

interface MonthState {}

export class Month extends Component<MonthProps, MonthState> {
  render ({ month, year }: MonthProps) {
    return (
      <div>
        <h1>{format(new Date(year, month - 1), 'MMMM YYYY')}</h1>
      </div>
    )
  }
}
