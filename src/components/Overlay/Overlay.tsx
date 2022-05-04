import React, { CSSProperties, useMemo, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { createNamespace } from '../../utils/bem'
import './index.less'

export type noop = (...args: any) => void

export interface OverlayProps {
	visible: boolean
	zIndex?: number
	style?: CSSProperties
	onClose?: noop
	lockScroll?: boolean // 是否阻止滚动穿透
	children?: React.ReactNode
}

const [classname] = createNamespace('overlay')

const Overlay = ({
	visible,
	zIndex,
	style,
	lockScroll,
	onClose,
	children
}: OverlayProps): JSX.Element => {
	const _style: CSSProperties = useMemo(() => {
		return {
			...style,
			zIndex: zIndex ?? 1
		}
	}, [zIndex])

	const handleTouch = (e: Event): void => {
		e.preventDefault()
	}

	useEffect(() => {
		// FIXBUG: 解决滚动穿透
		if (lockScroll && visible) {
			document.body.addEventListener('touchmove', handleTouch, {
				passive: false
			})
		}
		return () => {
			document.body.removeEventListener('touchmove', handleTouch)
		}
	}, [visible, lockScroll])

	const handleClose = (e: React.MouseEvent): void => {
		e.preventDefault()
		onClose()
	}

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					className={classname}
					style={_style}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={handleClose}
				>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default Overlay
