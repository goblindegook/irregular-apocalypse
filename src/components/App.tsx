import { h, Component } from 'preact'
import { Router, RouterOnChangeArgs } from 'preact-router'

import { Header } from './Header'
import { Home } from '../routes/Home'
import { Profile } from '../routes/Profile'

interface AppProps {}

interface AppState {}

export class App extends Component<AppProps, AppState> {
  currentUrl = ''

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
