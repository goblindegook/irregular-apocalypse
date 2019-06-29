import { useState, useEffect, StateUpdater } from 'preact/hooks'

export function useStateStore<T>(
  store: LocalForage,
  key: string,
  initialState: T | (() => T)
): [T, StateUpdater<T>] {
  const [state, setState] = useState<T>(initialState)

  useEffect(() => {
    // tslint:disable-next-line:no-floating-promises
    ;(async () => {
      try {
        await store.setItem(key, state)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [state])

  useEffect(() => {
    // tslint:disable-next-line:no-floating-promises
    ;(async () => {
      try {
        setState((await store.getItem<T>(key)) || initialState)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [])

  return [state, setState]
}
