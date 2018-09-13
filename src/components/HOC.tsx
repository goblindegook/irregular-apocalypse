import {
  h,
  ComponentFactory,
  ComponentConstructor,
  Component,
  VNode
} from 'preact'
import { RoutableProps } from 'preact-router'

type RouteParams = {
  [x: string]: string
}

type RouteProps < T > = RoutableProps & {
  matches?: T
  render: (props: T) => VNode
}

export const Route = ({ matches = {}, render }: RouteProps<RouteParams>) =>
  render(matches)

export function withProps<T = {}> (props: T) {
  return function<P> (
    BaseComponent: ComponentFactory<P>
  ): ComponentConstructor<P> {
    return class extends Component<P> {
      render () {
        return (
          <BaseComponent {...this.props} {...props}>
            {this.props.children}
          </BaseComponent>
        )
      }
    }
  }
}
