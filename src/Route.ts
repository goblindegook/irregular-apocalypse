import { VNode } from 'preact'
import { RoutableProps } from 'preact-router'

type RouteParams = {
  [x: string]: string
}

type RouteProps<T> = RoutableProps & {
  matches?: T
  render: (props: T) => VNode
}

export const Route = ({ matches = {}, render }: RouteProps<RouteParams>) => render(matches)
