import { useState, useEffect, useCallback } from 'react'

/**
 * @description 请求封装 对外暴露 data、loading、error
 * @param {*} asyncFunction
 * @param {*} immediate
 * @more 可以用SWR 替代
 * @date 2022-05-15 19:34:56
 */

export const useAsync = <T>(asyncFunction: (params: any) => Promise<T>, immediate = false) => {
	const [state, setState] = useState({
		loading: false,
		error: null,
		data: null
	})

	const execute = useCallback(
		(params: any) => {
			setState({
				loading: true,
				data: null,
				error: null
			})
			return asyncFunction(params)
				.then(response => {
					setState({
						loading: false,
						data: response as any,
						error: null
					})
				})
				.catch(error => {
					setState({
						loading: false,
						error,
						data: null
					})
				})
		},
		[asyncFunction]
	)

	// useEffect(() => {
	// 	if (immediate) {
	// 		execute()
	// 	}
	// }, [immediate])

	return [state, { execute }]
}
