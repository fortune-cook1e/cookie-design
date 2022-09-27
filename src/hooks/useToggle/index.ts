import { useCallback, useState } from 'react'

const useToggle = (initialValue: boolean = false) => {
	const [value, setValue] = useState(initialValue)
	const toggle = useCallback(() => setValue(!value), [])
	return [value, toggle] as const
}

export default useToggle
