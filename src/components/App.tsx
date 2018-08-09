import { h, Component } from 'preact'
import { Router, RouterOnChangeArgs } from 'preact-router'
import style from './App.style.css'
import { Header } from './Header'
import { Month } from './Month'

interface AppProps {}

interface AppState {}

export class App extends Component<AppProps, AppState> {
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
        <div class={style.main}>
          <Router onChange={this.handleRoute}>
            <Month path='/' month={month} year={year} />
            <Month path='/:year/:month' month={month} year={year} />
          </Router>
        </div>
      </div>
    )
  }
}
