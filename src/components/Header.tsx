import { h, Component } from 'preact'
import { Link } from 'preact-router/match'
import styled, { css } from 'preact-emotion'
import { withProps } from './HOC'

const homeLink = css`
  display: inline-block;
  height: 56px;
  line-height: 56px;
  padding: 0 15px;
  min-width: 50px;
  text-align: center;
  background: rgba(255, 255, 255, 0);
  text-decoration: none;
  color: #fff;
  will-change: background-color;

  &:hover,
  &:active {
    background: rgba(0, 0, 0, 0.2);
  }
`

const HeaderBar = styled('header')`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 56px;
  padding: 0;
  background: #673ab7;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  z-index: 50;

  @media print {
    display: none;
  }
`

const Title = styled('h1')`
  float: left;
  margin: 0;
  padding: 0;
  font-size: 24px;
  line-height: 56px;
  font-weight: 400;
  color: #fff;
`

const NameInput = withProps({
  type: 'text'
})(styled('input')`
  float: right;
  height: 26px;
  margin: 1rem;
  font-size: 1rem;
  padding: .25rem;
  font-size: .9rem;
`)

const SignatureLabel = styled('label')`
  color: #fff;
  border: 1px solid #fff;
  display: block;
  height: 26px;
  margin: 1rem 0 1rem 1rem;
  font-size: 1rem;
  padding: .25rem .5rem;
  cursor: pointer;
  float: right;
  font-size: .9rem;
  font-weight: 700;

  &:hover {
    background-color: #fff;
    color: #673ab7;
  }
`

const SignatureInput = withProps({
  accept: 'image/png, image/jpeg',
  type: 'file'
})(styled('input')`
  display: none;
`)

interface HeaderProps {
  name: string
  onNameChange: (name: string) => void
  onSignatureChange: (dataUrl: string) => void
}

export class Header extends Component<HeaderProps> {
  handleNameInput = (event: any) => {
    this.props.onNameChange && this.props.onNameChange(event.target.value)
  }

  handleSignatureChange = (event: any) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      this.props.onSignatureChange(reader.result as string)
    }
    
    if (file) {
      reader.readAsDataURL(file)
    }
  }

  render ({ name }: HeaderProps) {
    return (
      <HeaderBar>
        <Title>
          <Link activeClassName='' className={homeLink} href='/'>Irregular Apocalypse</Link>
        </Title>
        <NameInput placeholder='Your name' value={name} onInput={this.handleNameInput} />
        <SignatureLabel>
          Set Signature
          <SignatureInput onChange={this.handleSignatureChange} />
        </SignatureLabel>
      </HeaderBar>
    )
  }
}
