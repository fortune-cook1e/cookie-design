import { useMemo } from 'react'
import { useParams, useLocation, useHistory, useRouteMatch } from 'react-router-dom'
import queryString from 'query-string'

const useRouter = () => {
	const params = useParams()
	const location = useLocation()
	const history = useHistory()
	const match = useRouteMatch()

	const query = useMemo(() => queryString.parse(location.search), [location.search])

	const push = useMemo(() => (path: string, state: any) => history.push(path, state), [history])
	const replace = useMemo(
		() => (path: string, state: any) => history.replace(path, state),
		[history]
	)
	const go = useMemo(() => (n: number) => history.go(n), [history])
	const goBack = useMemo(() => () => history.goBack(), [history])
	const goForward = useMemo(() => () => history.goForward(), [history])

	return {
		params,
		location,
		history,
		match,
		query,
		push,
		replace,
		go,
		goBack,
		goForward
	}
}

export default useRouter
