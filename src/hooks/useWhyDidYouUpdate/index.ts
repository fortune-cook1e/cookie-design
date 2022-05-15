import { useEffect } from 'react'
import { usePrevious } from '../usePrevious'

/**
 * @description 检查为什么会重新render
 * @param {*} name
 * @param {*} props
 * @date 2022-05-15 19:53:15
 */
export const useWhyDidYouUpdate = (name, props) => {
	const previousProps = usePrevious(props)

	useEffect(() => {
		if (previousProps) {
			const allKeys = Object.keys({ ...previousProps, ...props })
			const changesObj = {}
			const didUpdate = allKeys.some(key => {
				if (previousProps[key] !== props[key]) {
					changesObj[key] = {
						from: previousProps[key],
						to: props[key]
					}
				}
				return previousProps[key] !== props[key]
			})

			if (didUpdate) {
				console.log('[Why did you update]', name, changesObj)
				console.groupCollapsed(name)
				console.table(changesObj)
				console.groupEnd()
			}
		}
	}, [previousProps, props])
}
