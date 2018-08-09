import { h, Component } from 'preact'
import { Link } from 'preact-router/match'
import style from './Header.style.css'

interface HeaderProps {}

interface HeaderState {}

export class Header extends Component<HeaderProps, HeaderState> {
  render () {
    return (
      <header class={style.header}>
        <h1><Link activeClassName={style.active} href='/'>Irregular Apocalypse</Link></h1>
      </header>
    )
  }
}
