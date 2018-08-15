import { h, Component } from 'preact'
import { Link } from 'preact-router/match'
import style from './Header.style.css'

interface HeaderProps {
  name?: string
  onNameChange?: (name: string) => void
  onSignatureChange?: (dataUrl: string) => void
}

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
      <header class={style.header}>
        <h1><Link activeClassName={style.active} href='/'>Irregular Apocalypse</Link></h1>
        <input
          class={style.nameField}
          placeholder='Your name'
          type='text'
          value={name}
          onInput={this.handleNameInput}
        />
        <label for='signature'>Signature</label>
        <input
          accept='image/png, image/jpeg'
          class={style.signatureField}
          id='signature'
          type='file'
          onChange={this.handleSignatureChange}
        />
      </header>
    )
  }
}
