import { useState, useEffect, useRef, StateUpdater } from 'preact/hooks'
import equals from 'ramda/es/equals'

export function useStateStore<T>(
  store: LocalForage,
  key: string,
  initialState: T | (() => T)
): [T, StateUpdater<T>] {
  const [state, setState] = useState<T>(initialState)
  const ref = useRef<T>(state)

  useEffect(() => {
    // tslint:disable-next-line:no-floating-promises
    ;(async () => {
      try {
        if (!equals(ref.current, state)) {
          await store.setItem(key, state)
          ref.current = state
        }
      } catch (e) {
        console.error(e)
      }
    })()
  }, [store, state])

  useEffect(() => {
    // tslint:disable-next-line:no-floating-promises
    ;(async () => {
      try {
        const storedState = await store.getItem<T>(key)
        setState(storedState)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [store])

  return [state, setState]
}
