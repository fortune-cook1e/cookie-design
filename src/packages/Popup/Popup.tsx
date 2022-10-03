import React, { FC, PropsWithChildren } from 'react'
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

	const onOverlayClick = () => {
		if (closeOnClickOverlay) {
			onClose()
		}
	}

	const renderOverlay = () => {
		if (overlay) return <Overlay visible={visible} onClose={onOverlayClick} />
		return null
	}

	return (
		<>
			{renderOverlay()}
			<AnimatePresence>
				{visible && (
					<motion.div
						// initial={{ x: 300 }}
						// animate={{ x: 0 }}
						// exit={{ x: -300 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						// transition={{ duration: 0.2 }}
						onClick={onClose}
					>
						<div className={bem({ [position]: position }) as string} style={style}>
							{children}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}

export default Popup
