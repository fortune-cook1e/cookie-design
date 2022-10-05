# cookie-ui

UI components base on react and typescript

## Components List 
- [x] Overlay
- [x] Popup
- [x] PullRefresh


## Dev

```bash
pnpm start

```
## Getting Started

```bash
pnpm add cookie-design
```

## Usage
```javascript
// example from Overlay
import React, { useState } from 'react'

import {Overlay} from 'cookie-design'

const Demo = () => {
	const [visible, setVisible] = useState<boolean>(false)

	const toggle = () => {
		setVisible(!visible)
	}

	return (
		<div>
			<h1>this is demo</h1>
			<button onClick={toggle}>toggle the overlay</button>

			<Overlay visible={visible} onClose={() => setVisible(false)} />
		</div>
	)
}

export default Demo
```