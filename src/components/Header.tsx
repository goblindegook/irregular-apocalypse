import { h, FunctionalComponent } from 'preact'
import { Link } from 'preact-router/match'
import style from './Header.style.css'

export const Header: FunctionalComponent = () => (
  <header class={style.header}>
    <h1><Link activeClassName={style.active} href='/'>Irregular Apocalypse</Link></h1>
  </header>
)
