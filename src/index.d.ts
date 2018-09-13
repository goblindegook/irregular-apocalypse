declare module '*.css' {
  const CSS: any
  export default CSS
}

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object ? RecursivePartial<T[P]> : T[P]
}
