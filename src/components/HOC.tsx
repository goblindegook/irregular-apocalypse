import { h, ComponentFactory, ComponentConstructor, Component, VNode } from "preact"
import { RoutableProps } from "preact-router"

type RouteParams = {
  [x: string]: string
}

type RouteProps = RoutableProps & {
  children: [ (params: RouteParams) => VNode ]
  matches?: RouteParams
}

export const Route = ({ children, matches = {} }: RouteProps) => children[0](matches)

export function withProps <T = {}>(props: T) {
  return function <P>(BaseComponent: ComponentFactory<P>): ComponentConstructor<P> {
    return class extends Component<P> {
      render() {
        return (<BaseComponent {...this.props} {...props}>{this.props.children}</BaseComponent>)
      }
    }
  }
}
