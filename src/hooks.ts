import { useState, useEffect, useRef, StateUpdater } from 'preact/hooks'
import { equals } from 'ramda'

export function useStateStore<T>(
  store: LocalForage,
  key: string,
  initialState: T | (() => T)
): [T, StateUpdater<T>, Error?] {
  const [state, setState] = useState<T>(initialState)
  const [error, setError] = useState<Error | undefined>(undefined)
  const ref = useRef<T>(state)

  useEffect(() => {
    ;(async () => {
      try {
        const storedValue = await store.getItem<T>(key)

        if (storedValue !== null) {
          ref.current = storedValue
          setState(storedValue)
        }

        setError(undefined)
      } catch (e) {
        setError(e)
      }
    })()
  }, [key, store])

  useEffect(() => {
    ;(async () => {
      try {
        if (!equals(ref.current, state)) {
          await store.setItem(key, state)
          setError(undefined)
        }
        ref.current = state
      } catch (e) {
        setError(e)
      }
    })()
  }, [key, state, store])

  return [state, setState, error]
}
