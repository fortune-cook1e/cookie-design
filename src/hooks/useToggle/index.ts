import { useCallback, useState } from 'react'

export const useToggle = (initialValue: boolean = false) => {
	const [value, setValue] = useState(initialValue)
	const toggle = useCallback(() => setValue(!value), [])
	return [value, toggle] as const
}
