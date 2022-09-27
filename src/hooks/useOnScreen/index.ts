import { useState, useEffect } from 'react'

const useOnScreen = (ref: React.RefObject<HTMLElement>, rootMargin = '0px') => {
	// State for keeping track of whether element is visible
	const [isIntersecting, setIntersecting] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				// Update our state when observer callback fires
				setIntersecting(entry.isIntersecting)
			},
			{
				rootMargin
			}
		)
		ref.current && observer.observe(ref.current)
		return () => {
			ref.current && observer.unobserve(ref.current)
		}
	}, [ref, rootMargin])

	return isIntersecting
}

export default useOnScreen
