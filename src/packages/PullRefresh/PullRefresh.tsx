import React, {
  CSSProperties,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
  TouchEvent
} from 'react'

import useScrollParent from '../../hooks/useScrollParent'
import useTouch from '../../hooks/useTouch'
import { createNamespace } from '../../utils/bem'
import { getScrollTop } from '../../utils/dom'

import { PullRefreshProps, PullRefreshStatus } from './types'

import './index.less'

const [clsx, bem] = createNamespace('pull-refresh')
const DEFAULT_HEAD_HEIGHT = 50
const TEXT_STATUS = ['pulling', 'loosing', 'success']

// doc:https://github.dev/youzan/vant
const PullRefresh: FC<PropsWithChildren<PullRefreshProps>> = (props): JSX.Element => {
  const {
    loading = false,
    loadingText = '加载中...',
    pullingText = '下拉即可刷新...',
    lossingTest = '释放即可刷新...',
    pullDistance = 50,
    headHeight = 50,
    onChange,
    onLoadingChange,
    onRefresh,
    children
  } = props

  const [state, setState] = useState<{
    status: PullRefreshStatus
    distance: number
    duration: number
  }>({
    status: 'normal',
    distance: 0,
    duration: 0
  })

  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  let reachTop = useRef<boolean>(false)

  const scrollParent = useScrollParent(rootRef)
  const touch = useTouch()

  const checkPosition = (event: TouchEvent) => {
    reachTop.current = getScrollTop(scrollParent.current!) === 0
    if (reachTop.current) {
      // state.duration = 0
      setState({
        ...state,
        duration: 0
      })
      touch.start(event)
    }
  }

  const onTouchMove = (event: TouchEvent<HTMLElement>) => {
    if (isTouchable) {
      if (!reachTop.current) {
        checkPosition(event)
      }

      const { deltaY } = touch
      touch.move(event)

      if (reachTop.current && deltaY.current >= 0 && touch.isVertical()) {
        event.preventDefault()
        setStatus(ease(deltaY.current))
      }
    }
  }

  const setStatus = (distance: number, isLoading?: boolean) => {
    const _pullDistance = Number(pullDistance || headHeight)

    let _status: PullRefreshStatus = 'loading'

    if (isLoading) {
      _status = 'loading'
    } else if (distance === 0) {
      _status = 'normal'
    } else if (distance < _pullDistance) {
      _status = 'pulling'
    } else {
      _status = 'loosing'
    }

    setState({
      ...state,
      status: _status,
      distance: distance
    })

    onChange?.(_status, distance)
  }

  useEffect(() => {
    if (loading) {
      setStatus(50, true)
    } else {
      setStatus(0, false)
    }
  }, [loading])

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.addEventListener('touchmove', onTouchMove as any)
    }
    return () => {
      trackRef.current?.removeEventListener('touchmove', onTouchMove as any)
    }
  }, [])

  const isTouchable = useMemo(() => {
    return state.status !== 'loading' && state.status !== 'success'
  }, [state])

  const ease = (distance: number) => {
    let _distance = distance
    const pullDistance = Number(props.pullDistance || props.headHeight)

    if (distance > pullDistance) {
      if (distance < pullDistance * 2) {
        _distance = pullDistance + (distance - pullDistance) / 2
      } else {
        _distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4
      }
    }

    return Math.round(_distance)
  }

  const getStatusText = () => {
    const { status } = state
    if (status === 'normal') {
      return ''
    }
    return `${status}`
  }

  const renderStatus = () => {
    const { status, distance } = state

    // if (slots[status]) {
    // 	return slots[status]!({ distance })
    // }

    const nodes: JSX.Element[] = []

    if (TEXT_STATUS.includes(status)) {
      return <div className={bem('text') as string}>{getStatusText()}</div>
    }
    if (status === 'loading') {
      return <div>loading..</div>
    }

    return null
  }

  const onTouchStart = (event: React.TouchEvent) => {
    if (isTouchable) {
      checkPosition(event)
    }
  }

  const onTouchEnd = () => {
    if (reachTop.current && touch.deltaY.current && isTouchable) {
      // state.duration = Number(props.animationDuration)

      if (state.status === 'loosing') {
        setStatus(Number(headHeight), true)
        onLoadingChange?.(true)
        onRefresh?.()
      } else {
        setStatus(0)
      }
    }
  }

  const trackStyle: CSSProperties = {
    transitionDuration: `${state.duration}ms`,
    transform: state.distance ? `translate3d(0,${state.distance}px, 0)` : ''
  }

  return (
    <div className={clsx} ref={rootRef}>
      <div
        ref={trackRef}
        className={bem('track') as string}
        style={trackStyle}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div className={bem('head') as string}>{renderStatus()}</div>
        {children}
      </div>
    </div>
  )
}

export default PullRefresh
