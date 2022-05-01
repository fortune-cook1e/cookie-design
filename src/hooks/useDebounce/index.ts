import { useEffect, useState } from 'react'
import useDebounceFn from '../useDebounceFn'
import type { DebounceOptions } from '../useDebounceFn/options'

/**
 * @description 根据value触发相应防抖函数
 * @param {T} value
 * @param {DebounceOptions} options
 * @date 2022-05-01 16:59:13
 */
function useDebounce<T>(value: T, options?: DebounceOptions) {
	const [debounced, setDebounced] = useState(value)

	const { run } = useDebounceFn(() => {
		setDebounced(value)
	}, options)

	useEffect(() => {
		run()
	}, [value])

	return debounced
}

export default useDebounce
