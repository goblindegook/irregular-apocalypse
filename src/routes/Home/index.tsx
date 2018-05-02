import { h, Component } from 'preact'
import style from './style.css'

interface HomeProps {
  readonly path: string
}

interface HomeState {}

export class Home extends Component<HomeProps, HomeState> {
  render () {
    return (
      <div class={style.home}>
        <h1>Home</h1>
        <p>This is the Home component.</p>
      </div>
    )
  }
}
