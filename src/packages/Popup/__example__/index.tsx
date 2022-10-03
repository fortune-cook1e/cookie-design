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
			<button onClick={toggle}>toggle the overlay</button>
			<Popup
				visible={visible}
				onClose={() => toggle()}
				position='left'
				style={{ width: '30%', height: '100%' }}
			>
				<div style={{ backgroundColor: '#fff' }}>click me</div>
			</Popup>
		</div>
	)
}

export default Demo
