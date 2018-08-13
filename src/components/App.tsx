import { h, Component } from 'preact'
import { Router, RouterOnChangeArgs } from 'preact-router'
import { Header } from './Header'
import { Month } from '../routes/Month'

export class App extends Component {
  currentUrl = ''

  handleRoute = (e: RouterOnChangeArgs) => {
    this.currentUrl = e.url
  }

  render () {
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    return (
      <div id='app'>
        <Header />
        <Router onChange={this.handleRoute}>
          <Month signature='Irregular Apocalypse' path='/' month={month} year={year} />
          <Month signature='Irregular Apocalypse' path='/:year/:month' month={month} year={year} />
        </Router>
      </div>
    )
  }
}
