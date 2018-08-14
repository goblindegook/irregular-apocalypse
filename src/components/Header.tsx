import { h, Component } from 'preact'
import { Link } from 'preact-router/match'
import style from './Header.style.css'

interface HeaderProps {
  name?: string
  onNameChange?: (name: string) => void
}

export class Header extends Component<HeaderProps> {
  handleInput = (event: any) => {
    const name = event.target.value
    this.props.onNameChange && this.props.onNameChange(name)
  }

  render ({ name }: HeaderProps) {
    return (
      <header class={style.header}>
        <h1><Link activeClassName={style.active} href='/'>Irregular Apocalypse</Link></h1>
        <input type='text' placeholder='Your name' value={name} onInput={this.handleInput} />
      </header>
    )
  }
}
