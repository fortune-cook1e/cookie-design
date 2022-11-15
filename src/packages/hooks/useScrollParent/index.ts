import { useEffect, useRef, MutableRefObject, RefObject } from 'react'

import { inBrowser } from '../../../utils'

type ScrollElement = HTMLElement | Window

const overflowScrollReg = /scroll|auto|overlay/i
const defaultRoot = inBrowser ? window : undefined

function isElement(node: Element) {
  const ELEMENT_NODE_TYPE = 1
  return node.tagName !== 'HTML' && node.tagName !== 'BODY' && node.nodeType === ELEMENT_NODE_TYPE
}

// https://github.com/vant-ui/vant/issues/3823
function getScrollParent(el: Element, root: ScrollElement | undefined = defaultRoot) {
  let node = el

  while (node && node !== root && isElement(node)) {
    const { overflowY } = window.getComputedStyle(node)
    if (overflowScrollReg.test(overflowY)) {
      return node
    }
    node = node.parentNode as Element
  }

  return root
}

function useScrollParent(el: RefObject<Element>, root: ScrollElement | undefined = defaultRoot) {
  const scrollParent = useRef<Element | Window>()

  useEffect(() => {
    if (el?.current) {
      scrollParent.current = getScrollParent(el.current, root)
    }
  }, [])

  return scrollParent
}

export default useScrollParent
