import React, { FC, PropsWithChildren, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Overlay from '../Overlay'
import { PopupProps } from './types'
import { createNamespace } from '../../utils/bem'
import './styles/index.less'

const [clx, bem] = createNamespace('popup')

const Popup: FC<PropsWithChildren<PopupProps>> = (props): JSX.Element => {
	const {
		visible = false,
		onClose,
		overlay = true,
		round = false,
		closeOnClickOverlay = true,
		position = 'center',
		style,
		children
	} = props

	const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {
		event.stopPropagation()
		onClose()
	}

	const onOverlayClick = () => {
		if (closeOnClickOverlay) {
			onClose()
		}
	}

	const renderOverlay = () => {
		if (overlay) return <Overlay visible={visible} onClose={onOverlayClick} />
		return null
	}

	const variants = useMemo(() => {
		switch (position) {
			case 'center':
				return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
			case 'top':
				return { initial: { y: -300 }, animate: { y: 0 }, exit: { y: -300 } }
			case 'right':
				return { initial: { x: 300 }, animate: { x: 0 }, exit: { x: 300 } }
			case 'left':
				return { initial: { x: -300 }, animate: { x: 0 }, exit: { x: -300 } }
			case 'bottom':
				return { initial: { y: 300 }, animate: { y: 0 }, exit: { y: 300 } }
		}
	}, [position])

	return (
		<>
			{renderOverlay()}
			<AnimatePresence>
				{visible && (
					<motion.div
						{...variants}
						transition={{ duration: 0.3 }}
						className={bem({ [position]: position }) as string}
						style={style}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}

export default Popup
