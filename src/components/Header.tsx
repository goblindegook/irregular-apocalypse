import { h, Component } from 'preact'
import styled from 'preact-emotion'
import { withProps } from '../HOC'
import { monthName } from '../calendar'
import { format, addMonths, subMonths } from 'date-fns'

const Link = styled('a')`
  background: rgba(255, 255, 255, 0);
  color: #fff;
  display: inline-block;
  line-height: 56px;
  margin: 0;
  min-width: 50px;
  padding: 0 15px;
  text-align: center;
  text-decoration: none;
  will-change: background-color;

  &:hover,
  &:active {
    background: rgba(0, 0, 0, 0.2);
  }

  @media print {
    color: black;
  }
`

const NavLink = styled(Link)`
  font-size: 24px;

  @media print {
    display: none;
  }
`

const HeaderBar = styled('header')`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 56px;
  padding: 0;
  background: #1795d4;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  z-index: 50;

  @media print {
    color: black;
    box-shadow: none;
    display: grid;
    grid-template-columns: 2;
    grid-template-rows: 1;
    height: auto;
    position: relative;
    background-color: transparent;
  }
`

const Title = styled('h1')`
  color: #fff;
  display: inline-block;
  font-size: 24px;
  font-weight: 400;
  line-height: 56px;
  margin: 0;
  padding: 0;

  @media print {
    grid-column: 1;
    grid-row: 1;
    line-height: 1;
  }
`

const NameInput = withProps({
  type: 'text'
})(styled('input')`
  float: right;
  height: 26px;
  margin: 1rem;
  font-size: 1rem;
  padding: 0.25rem;
  font-size: 0.9rem;

  @media print {
    background-color: transparent;
    grid-column: 2;
    grid-row: 1;
    padding: 0;
    border: 0;
    text-align: right;
  }
`)

const SignatureLabel = styled('label')`
  color: #fff;
  border: 1px solid #fff;
  display: block;
  height: 26px;
  margin: 1rem 0 1rem 1rem;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  float: right;
  font-size: 0.9rem;
  font-weight: 700;

  &:hover {
    background-color: #fff;
    color: #1795d4;
  }

  @media print {
    display: none;
  }
`

const SignatureInput = withProps({
  accept: 'image/png, image/jpeg',
  type: 'file'
})(styled('input')`
  display: none;
`)

interface HeaderProps {
  readonly name?: string
  readonly month: number
  readonly year: number
  readonly onNameChange: (name: string) => void
  readonly onSignatureChange: (dataUrl: string | ArrayBuffer | null) => void
}

export class Header extends Component<HeaderProps> {
  handleNameInput = (event: any) => {
    this.props.onNameChange(event.target.value)
  }

  handleSignatureChange = (event: any) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      this.props.onSignatureChange(reader.result)
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  render({ name = '', month, year }: HeaderProps) {
    return (
      <HeaderBar>
        <NavLink href={previous(year, month)} title="Previous">
          ◀
        </NavLink>
        <NavLink href={next(year, month)} title="Next">
          ▶
        </NavLink>
        <Title>
          <Link href="/">{monthName(year, month)}</Link>
        </Title>
        <NameInput placeholder="Your name" value={name} onInput={this.handleNameInput} />
        <SignatureLabel>
          Set Signature
          <SignatureInput onChange={this.handleSignatureChange} />
        </SignatureLabel>
      </HeaderBar>
    )
  }
}

function next(year: number, month: number): string {
  return format(addMonths(new Date(year, month - 1), 1), '/YYYY/MM')
}

function previous(year: number, month: number): string {
  return format(subMonths(new Date(year, month - 1), 1), '/YYYY/MM')
}
