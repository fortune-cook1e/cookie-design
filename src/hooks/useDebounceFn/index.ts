import { debounce } from 'lodash-es'
import { useMemo } from 'react'

import useLatest from '../useLatest'

import { DebounceOptions } from './options'

type noop = (...args: any) => any

/**
 * @description 防抖hooks
 * @param {T} fn 需要加防抖的函数
 * @param {DebounceOptions} options
 * @date 2022-05-01 16:56:22
 */
function useDebounceFn<T extends noop>(fn: T, options?: DebounceOptions) {
  const fnRef = useLatest(fn)

  const wait = options?.wait ?? 1000

  const debounced = useMemo(
    () =>
      debounce(
        (...args: any): ReturnType<T> => {
          return fnRef.current(...args)
        },
        wait,
        options
      ),
    []
  )

  return {
    run: debounced,
    cancel: debounced.cancel,
    flush: debounced.flush
  }
}

export default useDebounceFn
