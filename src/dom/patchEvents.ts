import isEvent from '../utils/isEvent'

function getEventName (event: string): string {
  return event.substring(2).toLowerCase()
}

function patchEvents (el: HTMLElement, prevVNode: TVNode, nextVNode: TVNode) {
  const prevProps = prevVNode.domProps
  const nextProps = nextVNode.domProps
  const prevPropsNames = Object.keys(prevProps)
  const nextPropsNames = Object.keys(nextProps)

  prevPropsNames.forEach((propName: string) => {
    if (isEvent(propName)) {
      el.removeEventListener(getEventName(propName), prevProps[propName])
    }
  })

  nextPropsNames.forEach((propName: string) => {
    if (isEvent(propName)) {
      el.addEventListener(getEventName(propName), nextProps[propName])
    }
  })

  return el
}

export default patchEvents
