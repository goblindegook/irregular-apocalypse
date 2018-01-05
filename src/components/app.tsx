import { h, Component } from 'preact'
import { Router, RouterOnChangeArgs } from 'preact-router'

import { Header } from './header'
import { Home } from '../routes/home'
import { Profile } from '../routes/profile'
// import { Home } from 'async!../routes/home';
// import { Profile } from 'async!../routes/profile';

interface AppProps {}

interface AppState {}

export class App extends Component<AppProps, AppState> {
  currentUrl: string

  handleRoute = (e: RouterOnChangeArgs) => {
    this.currentUrl = e.url
  }

  render () {
    return (
			<div id='app'>
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path='/' />
					<Profile path='/profile/' user='me' />
					<Profile path='/profile/:user' />
				</Router>
			</div>
    )
  }
}
