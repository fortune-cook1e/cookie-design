import { CSSProperties } from 'react'

export type PopupPosition = 'top' | 'left' | 'bottom' | 'right' | 'center'

export interface PopupProps {
	visible: boolean
	onClose: () => void
	overlay?: boolean
	round?: boolean
	closeOnClickOverlay?: boolean // 点击遮罩层是否关闭
	position?: PopupPosition
	style?: CSSProperties
}
