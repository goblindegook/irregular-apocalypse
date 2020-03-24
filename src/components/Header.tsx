import { createElement } from 'preact'
import { monthName } from '../calendar'
import { format, addMonths, subMonths } from 'date-fns'

function formatPath(date: Date): string {
  return format(date, '/yyyy/MM')
}

function next(year: number, month: number): string {
  return formatPath(addMonths(new Date(year, month - 1), 1))
}

function previous(year: number, month: number): string {
  return formatPath(subMonths(new Date(year, month - 1), 1))
}

export type HeaderProps = Readonly<{
  name?: string
  month: number
  year: number
  onNameChange: (name: string) => void
  onSignatureChange: (dataUrl: string) => void
}>

export const Header = ({
  name = '',
  month,
  year,
  onNameChange,
  onSignatureChange,
}: HeaderProps) => (
  <header class="c-Header-Bar">
    <a class="c-Header-ArrowLink" href={previous(year, month)} title="Previous">
      ◀
    </a>
    <a class="c-Header-ArrowLink" href={next(year, month)} title="Next">
      ▶
    </a>
    <h1 class="c-Header-Title">
      <a class="c-Header-Link" href="/">
        {monthName(year, month)}
      </a>
    </h1>
    <input
      class="c-Header-NameInput"
      type="text"
      placeholder="Your name"
      value={name}
      onInput={(event: any) => {
        onNameChange(event.target.value)
      }}
    />
    <label class="c-Header-SignatureLabel">
      Set Signature
      <input
        class="c-Header-SignatureInput"
        accept="image/png, image/jpeg"
        type="file"
        onChange={(event: any) => {
          const file = event.target.files[0]
          const reader = new FileReader()

          reader.onloadend = () => {
            onSignatureChange(String(reader.result))
          }

          if (file) {
            reader.readAsDataURL(file)
          }
        }}
      />
    </label>
  </header>
)
