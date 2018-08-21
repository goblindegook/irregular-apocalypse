import { h, Component } from 'preact'
import { Link } from 'preact-router/match'
import { css } from 'preact-emotion'

interface HeaderProps {
  name?: string
  onNameChange?: (name: string) => void
  onSignatureChange?: (dataUrl: string) => void
}

const header = css`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 56px;
  padding: 0;
  background: #673ab7;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  z-index: 50;

  h1 {
    float: left;
    margin: 0;
    padding: 0;
    font-size: 24px;
    line-height: 56px;
    font-weight: 400;
    color: #fff;
  }

  a {
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
  }

  a:hover,
  a:active {
    background: rgba(0, 0, 0, 0.2);
  }

  @media print {
    display: none;
  }
`

const nameField = css`
  float: right;
  height: 26px;
  margin: 1rem;
  font-size: 1rem;
  padding: .25rem;
  font-size: .9rem;
`

const signatureField = css`
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

  input[type='file'] {
    display: none;
  }
`

export class Header extends Component<HeaderProps> {
  handleNameInput = (event: any) => {
    this.props.onNameChange && this.props.onNameChange(event.target.value)
  }

  handleSignatureChange = (event: any) => {
    const file = event.target.files[0]
    const reader = new FileReader()

    console.log(file)

    reader.onloadend = () => {
      this.props.onSignatureChange && this.props.onSignatureChange(reader.result as string)
    }
    
    if (file) {
      reader.readAsDataURL(file)
    }
  }

  render ({ name }: HeaderProps) {
    return (
      <header class={header}>
        <h1><Link activeClassName='' href='/'>Irregular Apocalypse</Link></h1>
        <input
          class={nameField}
          placeholder='Your name'
          type='text'
          value={name}
          onInput={this.handleNameInput}
        />
        <label class={signatureField}>
          <span>Set Signature</span>
          <input
            accept='image/png, image/jpeg'
            type='file'
            onChange={this.handleSignatureChange}
          />
        </label>
      </header>
    )
  }
}
