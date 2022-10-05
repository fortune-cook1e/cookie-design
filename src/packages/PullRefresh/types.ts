export interface PullRefreshProps {
	loading?: Boolean
	pullingText?: string // 下拉过程提示文案
	lossingTest?: string // 释放过程提示文案
	loadingText?: string // 加载过程提示文案
	pullDistance?: number // 触发下拉刷新的距离
	headHeight?: number // 顶部内容高度
	onLoadingChange: (loading: boolean) => void
	onRefresh?: () => void // 下拉刷新时触发
	onChange?: (status: PullRefreshStatus, distance: number) => void
}

export type PullRefreshStatus = 'normal' | 'loading' | 'loosing' | 'pulling' | 'success'
