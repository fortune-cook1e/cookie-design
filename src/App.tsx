import * as fs from 'fs-extra'
import React, { useMemo, useState, Suspense, lazy } from 'react'
import { render } from 'react-dom'
import './app.less'

const App = (): JSX.Element => {
  const [com, setCom] = useState<string>(COMPONENTS[2])

  const DemoComponent: any = useMemo(() => {
    if (!com) return null
    const Component = lazy(() => import(`./packages/${com}/__example__/index.tsx`))
    return Component
  }, [com])

  const onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setCom(value)
  }

  return (
    <div className='app'>
      <h2>this is app</h2>
      <select name='component' value={com} onChange={onSelect}>
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
