import { h, ComponentFactory, ComponentConstructor, Component } from "preact"

export function withProps <T = {}>(props: T) {
  return function <P>(BaseComponent: ComponentFactory<P>): ComponentConstructor<P> {
    return class extends Component<P> {
      render() {
        return (<BaseComponent {...this.props} {...props}>{this.props.children}</BaseComponent>)
      }
    }
  }
}
