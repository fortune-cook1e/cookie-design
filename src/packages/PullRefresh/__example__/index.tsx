import React, { useState } from 'react'

import PullRefresh from '../PullRefresh'

const Demo = () => {
	const [loading, setLoading] = useState<boolean>(false)

	const onRefresh = () => {
		setTimeout(() => {
			console.log('onfresh callback...')
			setLoading(false)
		}, 1000)
	}

	const onLoadingChange = l => {
		setLoading(l)
	}

	return (
		<PullRefresh loading={loading} onRefresh={onRefresh} onLoadingChange={onLoadingChange}>
			pull me {loading ? 'loading true' : 'loading false'}
		</PullRefresh>
	)
}

export default Demo
