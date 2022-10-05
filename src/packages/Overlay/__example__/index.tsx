import React, { useState } from 'react'

import Overlay from '../Overlay'

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
