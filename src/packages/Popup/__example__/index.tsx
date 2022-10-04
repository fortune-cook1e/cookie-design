import React, { useState } from 'react'
import Popup from '../Popup'

const Demo = () => {
	const [visible, setVisible] = useState<boolean>(false)

	const toggle = () => {
		setVisible(!visible)
	}

	return (
		<div>
			<h1>this is Popup</h1>
			<button onClick={toggle}>toggle the popup</button>
			<Popup visible={visible} onClose={() => toggle()} position='right' style={{ width: '50%' }}>
				click me
			</Popup>
		</div>
	)
}

export default Demo
