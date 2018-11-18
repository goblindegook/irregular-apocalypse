import { h, ComponentFactory, VNode } from 'preact'
import { RoutableProps } from 'preact-router'

type RouteParams = {
  [x: string]: string
}

type RouteProps<T> = RoutableProps & {
  matches?: T
  render: (props: T) => VNode
}

export const Route = ({ matches = {}, render }: RouteProps<RouteParams>) => render(matches)

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

interface ComponentEnhancer<Injected, Needed> {
  <P extends Partial<Injected>>(
    component: ComponentFactory<P> // FIXME
  ): ComponentFactory<Omit<P, keyof Injected> & Needed>
}

export function withProps<I, O>(injected: I): ComponentEnhancer<I & O, O> {
  return component => props =>
    h(
      component as any, // FIXME
      Object.assign({}, props, injected),
      ...(Array.isArray(props.children) ? props.children : [props.children])
    )
}
