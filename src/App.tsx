import React, { useMemo, useState, Suspense, lazy } from 'react'
import * as fs from 'fs-extra'
import { render } from 'react-dom'

const App = (): JSX.Element => {
	const [com, setCom] = useState<string>(COMPONENTS[0])

	const DemoComponent: any = useMemo(() => {
		if (!com) return null
		const Component = lazy(() => import(`./components/${com}/demo/index.tsx`))
		return Component
	}, [com])

	return (
		<div>
			<h2>this is app</h2>
			<select name='component'>
				{COMPONENTS.map(c => {
					return (
						<option key={c} value={c}>
							{c}
						</option>
					)
				})}
			</select>
			<Suspense fallback='loading...'>
				<DemoComponent />
			</Suspense>
		</div>
	)
}

const ELEMENT = document.getElementById('root')

render(<App />, ELEMENT)

export default App
