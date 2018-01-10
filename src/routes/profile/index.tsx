import { h, Component } from 'preact'
import style from './style.css'

interface ProfileProps {
  user?: string
}

interface ProfileState {
  count: number
  time: number
}

export class Profile extends Component<ProfileProps, ProfileState> {
  timer: NodeJS.Timer

  state: ProfileState = {
    count: 10,
    time: Date.now()
  }

  // gets called when this route is navigated to
  componentDidMount () {
    // start a timer for the clock:
    this.timer = setInterval(this.updateTime, 1000)
  }

  // gets called just before navigating away from the route
  componentWillUnmount () {
    clearInterval(this.timer)
  }

  // update the current time
  updateTime = () => {
    this.setState({ time: Date.now() })
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 })
  }

  // Note: `user` comes from the URL, courtesy of our router
  render ({ user }: ProfileProps, { time, count }: ProfileState) {
    return (
      <div class={style.profile}>
        <h1>Profile: {user}</h1>
        <p>This is the user profile for a user named {user}.</p>

        <div>Current time: {new Date(time).toLocaleString()}</div>

        <p>
          <button onClick={this.increment}>Click Me</button> Clicked {count}{' '}
          times.
        </p>
      </div>
    )
  }
}
